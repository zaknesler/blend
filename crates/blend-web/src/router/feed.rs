use crate::error::{WebError, WebResult};
use axum::{
    extract::{Path, State},
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
        .route("/:uuid", get(view))
        // .route_layer(middleware::from_fn_with_state(
        //     ctx.clone(),
        //     crate::middleware::auth::middleware,
        // ))
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

    let parsed = blend_feed::parse_url(&data.url).await?;

    let parsed2 = parsed.clone();
    let feed = repo::feed::FeedRepo::new(ctx.db)
        .create_feed(repo::feed::CreateFeedParams {
            title: parsed2.title,
            url: parsed2.url,
            published_at: parsed2.published_at,
            updated_at: parsed2.updated_at,
        })
        .await?;

    // Fetch + write feed metadata
    // Fetch + create feed entries
    ctx.worker.send(blend_worker::Job::FetchMetadata(parsed)).await?;

    Ok(Json(json!({ "data": feed })))
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
