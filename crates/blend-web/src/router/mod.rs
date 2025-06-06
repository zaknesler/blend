use super::error::WebResult;
use axum::{response::IntoResponse, routing::get, Router};

mod entry;
mod feed;
mod folder;
mod ui;
mod user;
mod ws;

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
        .nest("/feeds", feed::router(ctx.clone()))
        .nest("/entries", entry::router(ctx.clone()))
        .nest("/folders", folder::router(ctx.clone()))
        .nest("/ws", ws::router(ctx))
}

async fn index() -> WebResult<impl IntoResponse> {
    Ok("index")
}
