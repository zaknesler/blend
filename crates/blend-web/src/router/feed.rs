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

pub fn router(ctx: blend_context::Context) -> Router {
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

async fn index(State(ctx): State<blend_context::Context>) -> WebResult<impl IntoResponse> {
    let feeds = repo::feed::FeedRepo::new(ctx).get_feeds().await?;
    Ok(Json(json!({ "data": feeds })))
}

#[derive(Debug, Deserialize, Validate)]
struct AddFeedParams {
    #[validate(url(message = "Must be a valid URL"))]
    url: String,
}

async fn create(
    State(ctx): State<blend_context::Context>,
    Json(data): Json<AddFeedParams>,
) -> WebResult<impl IntoResponse> {
    data.validate()?;

    let parsed = blend_parse::parse_url(&data.url).await?;

    let link = parsed
        .links
        .iter()
        .find(|link| link.rel.as_ref().is_some_and(|rel| rel == "self"));

    let feed = repo::feed::FeedRepo::new(ctx)
        .create_feed(repo::feed::CreateFeedParams {
            title: parsed.title.map(|title| title.content),
            url: link.map(|link| link.href.clone()),
            published_at: parsed.published,
            updated_at: parsed.updated,
        })
        .await?;

    Ok(Json(json!({ "data": feed })))
}

#[derive(Deserialize)]
struct ViewFeedParams {
    uuid: Uuid,
}

async fn view(
    State(ctx): State<blend_context::Context>,
    Path(params): Path<ViewFeedParams>,
) -> WebResult<impl IntoResponse> {
    let feed = repo::feed::FeedRepo::new(ctx)
        .get_feed(params.uuid)
        .await?
        .ok_or_else(|| WebError::NotFoundError)?;

    Ok(Json(json!({ "data": feed })))
}
