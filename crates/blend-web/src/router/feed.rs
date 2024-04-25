use crate::error::WebResult;
use axum::{
    extract::State,
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
};
use blend_db::repo;
use serde::Deserialize;
use serde_json::json;
use validator::Validate;

pub fn router(ctx: blend_context::Context) -> Router {
    Router::new()
        .route("/", get(index))
        .route("/", post(add))
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

async fn add(
    State(ctx): State<blend_context::Context>,
    Json(data): Json<AddFeedParams>,
) -> WebResult<impl IntoResponse> {
    data.validate()?;

    let parsed = blend_parse::parse_url(&data.url).await?;
    let feed = repo::feed::FeedRepo::new(ctx)
        .create_feed(repo::feed::CreateFeedParams {
            title: parsed.title.map(|title| title.content),
            url: Some("https://blog.rust-lang.org/feed.xml".to_string()),
            published_at: parsed.published,
            updated_at: parsed.updated,
        })
        .await?;

    Ok(Json(json!({ "data": feed })))
}
