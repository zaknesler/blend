use crate::error::WebResult;
use axum::{
    extract::State, middleware::from_fn_with_state, response::IntoResponse, routing::post, Json,
    Router,
};
use blend_db::repo::{self};
use serde::{Deserialize, Serialize};
use serde_json::json;
use typeshare::typeshare;

#[typeshare]
#[derive(Debug, Serialize)]
struct FolderResponse {
    label: String,
    slug: String,
    feed_uuids: Vec<uuid::Uuid>,
}

pub fn router(ctx: crate::Context) -> Router {
    Router::new()
        .route("/", post(create))
        .route_layer(from_fn_with_state(ctx.clone(), crate::middleware::auth))
        .with_state(ctx)
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

    Ok(Json(json!({
        "data": FolderResponse {
            slug: folder.slug,
            label: folder.label,
            feed_uuids: vec![],
        }
    })))
}
