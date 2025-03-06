use crate::error::{WebError, WebResult};
use axum::{
    extract::{Path, State},
    middleware::from_fn_with_state,
    response::IntoResponse,
    routing::{get, patch, post},
    Json, Router,
};
use blend_db::repo::{self, feed::FeedRepo};
use serde::Deserialize;
use serde_json::json;
use typeshare::typeshare;
use uuid::Uuid;
use validator::Validate;

pub fn router(ctx: crate::Context) -> Router {
    Router::new()
        .route("/", get(index))
        .route("/", post(create))
        .route("/refresh", post(refresh_feeds))
        .route("/stats", get(stats))
        .route("/:uuid", get(view))
        .route("/:uuid/read", post(update_read))
        .route("/:uuid/refresh", post(refresh_feed))
        .route("/:uuid/folders", patch(update_folders))
        .route_layer(from_fn_with_state(ctx.clone(), crate::middleware::auth))
        .with_state(ctx)
}

async fn index(State(ctx): State<crate::Context>) -> WebResult<impl IntoResponse> {
    let feeds = FeedRepo::new(ctx.db).get_feeds().await?;
    Ok(Json(json!({ "data": feeds })))
}

#[typeshare]
#[derive(Debug, Deserialize, Validate)]
struct CreateFeedData {
    #[validate(url(message = "Must be a valid URL"))]
    url: String,
}

async fn create(
    State(ctx): State<crate::Context>,
    Json(data): Json<CreateFeedData>,
) -> WebResult<impl IntoResponse> {
    data.validate()?;

    let parsed = blend_feed::parse_feed(&data.url).await?;
    let feed = FeedRepo::new(ctx.db)
        .create_feed(repo::feed::CreateFeedData {
            id: parsed.id,
            title: parsed.title.unwrap_or_else(|| data.url.clone()),
            url_feed: parsed.url_feed,
            url_site: parsed.url_site,
            favicon_url: parsed.favicon_url,
            published_at: parsed.published_at,
            updated_at: parsed.updated_at,
        })
        .await?;

    let worker = ctx.job_tx.lock().await;
    worker.send(blend_worker::Job::FetchFavicon(feed.clone())).await?;
    worker.send(blend_worker::Job::FetchEntries(feed.clone())).await?;

    Ok(Json(json!({ "data": feed })))
}

async fn stats(State(ctx): State<crate::Context>) -> WebResult<impl IntoResponse> {
    let stats = FeedRepo::new(ctx.db).get_stats().await?;

    Ok(Json(json!({ "data": stats })))
}

#[derive(Deserialize)]
struct ViewFeedParams {
    uuid: Uuid,
}

async fn view(
    State(ctx): State<crate::Context>,
    Path(params): Path<ViewFeedParams>,
) -> WebResult<impl IntoResponse> {
    let feed = FeedRepo::new(ctx.db)
        .get_feed(params.uuid)
        .await?
        .ok_or_else(|| WebError::NotFoundError)?;

    Ok(Json(json!({ "data": feed })))
}

async fn update_read(
    State(ctx): State<crate::Context>,
    Path(params): Path<ViewFeedParams>,
) -> WebResult<impl IntoResponse> {
    let success = FeedRepo::new(ctx.db).update_feed_as_read(&params.uuid).await?;

    Ok(Json(json!({ "success": success })))
}

async fn refresh_feed(
    State(ctx): State<crate::Context>,
    Path(params): Path<ViewFeedParams>,
) -> WebResult<impl IntoResponse> {
    let feed = FeedRepo::new(ctx.db)
        .get_feed(params.uuid)
        .await?
        .ok_or_else(|| WebError::NotFoundError)?;

    let notif_tx = ctx.notif_tx.lock().await;
    let job_tx = ctx.job_tx.lock().await;

    notif_tx.send(blend_worker::Notification::StartedFeedRefresh {
        feed_uuid: feed.uuid,
    })?;
    job_tx.send(blend_worker::Job::FetchFavicon(feed.clone())).await?;
    job_tx.send(blend_worker::Job::FetchEntries(feed.clone())).await?;

    Ok(Json(json!({ "success": true })))
}

async fn refresh_feeds(State(ctx): State<crate::Context>) -> WebResult<impl IntoResponse> {
    let feeds = FeedRepo::new(ctx.db).get_feeds().await?;

    let notifier = ctx.notif_tx.lock().await;
    let dispatcher = ctx.job_tx.lock().await;

    for feed in feeds {
        notifier.send(blend_worker::Notification::StartedFeedRefresh {
            feed_uuid: feed.uuid,
        })?;
        dispatcher.send(blend_worker::Job::FetchEntries(feed.clone())).await?;
    }

    Ok(Json(json!({ "success": true })))
}

#[typeshare]
#[derive(Debug, Deserialize)]
struct UpdateFeedFoldersData {
    folder_uuids: Vec<uuid::Uuid>,
}

/// Replace the folders to which the given feed is associated.
async fn update_folders(
    State(ctx): State<crate::Context>,
    Path(params): Path<ViewFeedParams>,
    Json(data): Json<UpdateFeedFoldersData>,
) -> WebResult<impl IntoResponse> {
    let repo = repo::folder::FolderRepo::new(ctx.db);

    let was_deleted = repo.delete_all_folders_by_feed_uuid(&params.uuid).await?;
    let inserted_uuids =
        repo.insert_folder_uuids_by_feed_uuid(&params.uuid, &data.folder_uuids).await?;

    // If the number of inserted feeds matches what we expected, it's a great success!
    let success = was_deleted && inserted_uuids.len() == data.folder_uuids.len();

    Ok(Json(json!({ "success": success })))
}
