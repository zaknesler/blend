use super::error::WebResult;
use axum::{response::IntoResponse, routing::get, Router};

mod feed;
mod ui;
mod user;

pub const JWT_COOKIE: &str = "blend_jwt";
// pub const CSRF_COOKIE: &str = "blend_csrf";

pub fn router(ctx: crate::Context) -> Router {
    Router::new()
        .with_state(ctx.clone())
        .nest("/api", api_router(ctx))
        .merge(ui::router())
}

pub fn api_router(ctx: crate::Context) -> Router {
    Router::new()
        .route("/", get(index))
        .with_state(ctx.clone())
        .nest("/users", user::router(ctx.clone()))
        .nest("/feeds", feed::router(ctx))
}

async fn index() -> WebResult<impl IntoResponse> {
    Ok("index")
}
