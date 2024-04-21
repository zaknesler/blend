use super::{error::WebResult, middleware::guest};
use crate::context::Context;
use axum::{middleware, response::IntoResponse, routing::get, Router};

mod ui;
mod user;

pub const JWT_COOKIE: &str = "blend_jwt";
// pub const CSRF_COOKIE: &str = "blend_csrf";

pub fn router(ctx: Context) -> Router {
    Router::new()
        .with_state(ctx.clone())
        .nest("/api", api_router(ctx))
        .merge(ui::router())
}

pub fn api_router(ctx: Context) -> Router {
    Router::new()
        .route("/", get(index))
        .route_layer(middleware::from_fn(guest::middleware))
        .with_state(ctx.clone())
        .nest("/users", user::router(ctx))
}

async fn index() -> WebResult<impl IntoResponse> {
    Ok("index")
}
