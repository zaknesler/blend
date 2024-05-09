use crate::error::{WebError, WebResult};
use axum::{
    extract::{Path, State},
    middleware::from_fn_with_state,
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
};
use blend_db::repo;
use serde::Deserialize;
use serde_json::json;
use uuid::Uuid;
use validator::Validate;

pub fn router(ctx: crate::Context) -> Router {
    Router::new()
        .route("/", get(index))
        .route("/", post(create))
        .route("/refresh", post(refresh_feeds))
        .route("/stats", get(stats))
        .route("/:uuid", get(view))
        .route("/:uuid/refresh", post(refresh_feed))
        .route_layer(from_fn_with_state(ctx.clone(), crate::middleware::auth))
        .with_state(ctx)
}

async fn index(State(ctx): State<crate::Context>) -> WebResult<impl IntoResponse> {
    let feeds = repo::feed::FeedRepo::new(ctx.db).get_feeds().await?;
    Ok(Json(json!({ "data": feeds })))
}

#[derive(Debug, Deserialize, Validate)]
struct AddFeedParams {
    #[validate(url(message = "Must be a valid URL"))]
    url: String,
}

async fn create(
    State(ctx): State<crate::Context>,
    Json(data): Json<AddFeedParams>,
) -> WebResult<impl IntoResponse> {
    data.validate()?;

    let parsed = blend_feed::parse_feed(&data.url).await?;
    let feed = repo::feed::FeedRepo::new(ctx.db)
        .create_feed(repo::feed::CreateFeedParams {
            id: parsed.id,
            title: parsed.title,
            url_feed: parsed.url,
            published_at: parsed.published_at,
            updated_at: parsed.updated_at,
        })
        .await?;

    let worker = ctx.jobs.lock().await;
    worker.send(blend_worker::Job::FetchMetadata(feed.clone())).await?;
    worker.send(blend_worker::Job::FetchEntries(feed.clone())).await?;

    Ok(Json(json!({ "data": feed })))
}

async fn stats(State(ctx): State<crate::Context>) -> WebResult<impl IntoResponse> {
    let stats = repo::feed::FeedRepo::new(ctx.db).get_stats().await?;

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
    let feed = repo::feed::FeedRepo::new(ctx.db)
        .get_feed(params.uuid)
        .await?
        .ok_or_else(|| WebError::NotFoundError)?;

    Ok(Json(json!({ "data": feed })))
}

async fn refresh_feed(
    State(ctx): State<crate::Context>,
    Path(params): Path<ViewFeedParams>,
) -> WebResult<impl IntoResponse> {
    let feed = repo::feed::FeedRepo::new(ctx.db)
        .get_feed(params.uuid)
        .await?
        .ok_or_else(|| WebError::NotFoundError)?;

    let notifier = ctx.notifs.lock().await;
    let dispatcher = ctx.jobs.lock().await;

    notifier.send(blend_worker::Notification::StartedFeedRefresh {
        feed_uuid: feed.uuid,
    })?;
    dispatcher.send(blend_worker::Job::FetchMetadata(feed.clone())).await?;
    dispatcher.send(blend_worker::Job::FetchEntries(feed.clone())).await?;

    Ok(Json(json!({ "success": true })))
}

async fn refresh_feeds(State(ctx): State<crate::Context>) -> WebResult<impl IntoResponse> {
    let feeds = repo::feed::FeedRepo::new(ctx.db).get_feeds().await?;

    let notifier = ctx.notifs.lock().await;
    let dispatcher = ctx.jobs.lock().await;

    for feed in feeds {
        notifier.send(blend_worker::Notification::StartedFeedRefresh {
            feed_uuid: feed.uuid,
        })?;
        dispatcher.send(blend_worker::Job::FetchMetadata(feed.clone())).await?;
        dispatcher.send(blend_worker::Job::FetchEntries(feed.clone())).await?;
    }

    Ok(Json(json!({ "success": true })))
}
