use axum::{middleware, response::IntoResponse, routing::get, Router};

use crate::context::Context;

pub fn router(ctx: Context) -> Router {
    Router::new()
        .route("/", get(index))
        .route_layer(middleware::from_fn_with_state(
            ctx.clone(),
            crate::middleware::auth::middleware,
        ))
        .with_state(ctx)
}

async fn index() -> impl IntoResponse {
    "hi"
}
