use crate::error::WebResult;
use axum::{
    Json, Router,
    extract::{Path, State},
    middleware::from_fn_with_state,
    response::IntoResponse,
    routing::{get, patch, post},
};
use blend_db::repo::{self};
use serde::Deserialize;
use serde_json::json;
use typeshare::typeshare;

pub fn router(ctx: crate::Context) -> Router {
    Router::new()
        .route("/", get(index))
        .route("/", post(create))
        .route("/{uuid}", patch(update_uuids))
        .route_layer(from_fn_with_state(ctx.clone(), crate::middleware::auth))
        .with_state(ctx)
}

async fn index(State(ctx): State<crate::Context>) -> WebResult<impl IntoResponse> {
    let folders = repo::folder::FolderRepo::new(ctx.db).get_folders_with_uuids().await?;

    Ok(Json(json!({ "data": folders })))
}

#[typeshare]
#[derive(Debug, Deserialize)]
struct CreateFolderData {
    label: String,
    slug: String,
}

async fn create(
    State(ctx): State<crate::Context>,
    Json(data): Json<CreateFolderData>,
) -> WebResult<impl IntoResponse> {
    let repo = repo::folder::FolderRepo::new(ctx.db);
    let folder = repo
        .create_folder(repo::folder::CreateFolderData {
            label: data.label,
            slug: data.slug,
        })
        .await?;

    Ok(Json(json!({ "data": folder })))
}

#[derive(Debug, Deserialize)]
struct UpdateFolderUuidsParams {
    uuid: uuid::Uuid,
}
#[typeshare]
#[derive(Debug, Deserialize)]
struct UpdateFolderFeedsData {
    feed_uuids: Vec<uuid::Uuid>,
}

/// Remove all current feed UUIDs for a given folder and replace them with the given list.
async fn update_uuids(
    State(ctx): State<crate::Context>,
    Path(params): Path<UpdateFolderUuidsParams>,
    Json(data): Json<UpdateFolderFeedsData>,
) -> WebResult<impl IntoResponse> {
    let repo = repo::folder::FolderRepo::new(ctx.db);

    let was_deleted = repo.delete_all_feeds_by_uuid(&params.uuid).await?;
    let inserted_uuids = repo.insert_feed_uuids_by_uuid(&params.uuid, &data.feed_uuids).await?;

    // If the number of inserted feeds matches what we expected, it's a great success!
    let success = was_deleted && inserted_uuids.len() == data.feed_uuids.len();

    Ok(Json(json!({ "success": success })))
}
