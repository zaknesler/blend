use crate::error::WebResult;
use axum::{
    extract::State,
    middleware::from_fn_with_state,
    response::IntoResponse,
    routing::{get, patch, post},
    Json, Router,
};
use blend_db::repo::{self};
use serde::Deserialize;
use serde_json::json;
use typeshare::typeshare;

pub fn router(ctx: crate::Context) -> Router {
    Router::new()
        .route("/", get(index))
        .route("/:slug", patch(update_uuids))
        .route("/", post(create))
        .route_layer(from_fn_with_state(ctx.clone(), crate::middleware::auth))
        .with_state(ctx)
}

async fn index(State(ctx): State<crate::Context>) -> WebResult<impl IntoResponse> {
    let folders = repo::folder::FolderRepo::new(ctx.db).get_folders_with_uuids().await?;

    Ok(Json(json!({ "data": folders })))
}

#[typeshare]
#[derive(Debug, Deserialize)]
struct CreateFolderParams {
    label: String,
    slug: String,
}

async fn create(
    State(ctx): State<crate::Context>,
    Json(data): Json<CreateFolderParams>,
) -> WebResult<impl IntoResponse> {
    let repo = repo::folder::FolderRepo::new(ctx.db);
    let folder = repo
        .create_folder(repo::folder::CreateFolderParams {
            label: data.label,
            slug: data.slug,
        })
        .await?;

    Ok(Json(json!({ "data": folder })))
}

#[typeshare]
#[derive(Debug, Deserialize)]
struct UpdateFolderParams {
    slug: String,
    feed_uuids: Vec<uuid::Uuid>,
}

async fn update_uuids(
    State(ctx): State<crate::Context>,
    Json(data): Json<UpdateFolderParams>,
) -> WebResult<impl IntoResponse> {
    let repo = repo::folder::FolderRepo::new(ctx.db);

    let was_deleted = repo.delete_uuids_by_slug(&data.slug).await?;
    let inserted_uuids = repo.insert_uuids_by_slug(&data.slug, &data.feed_uuids).await?;

    let success = was_deleted && inserted_uuids.len() == data.feed_uuids.len();

    Ok(Json(json!({ "success": success })))
}
