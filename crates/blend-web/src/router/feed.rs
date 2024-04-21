use crate::{context::Context, error::WebResult};
use axum::{response::IntoResponse, routing::get, Json, Router};
use blend_parse::parse_url;
use serde_json::json;

pub fn router(ctx: Context) -> Router {
    Router::new()
        .route("/", get(index))
        // .route_layer(middleware::from_fn_with_state(
        //     ctx.clone(),
        //     crate::middleware::auth::middleware,
        // ))
        .with_state(ctx)
}

async fn index() -> WebResult<impl IntoResponse> {
    let parsed = parse_url("https://blog.rust-lang.org/feed.xml").await?;

    Ok(Json(json!({
        "data": vec![parsed]
    })))
}
