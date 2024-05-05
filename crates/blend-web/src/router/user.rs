use axum::{middleware::from_fn_with_state, response::IntoResponse, routing::get, Router};

pub fn router(ctx: crate::Context) -> Router {
    Router::new()
        .route("/", get(index))
        .route_layer(from_fn_with_state(ctx.clone(), crate::middleware::auth))
        .with_state(ctx)
}

async fn index() -> impl IntoResponse {
    "users"
}
