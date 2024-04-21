use crate::context::Context;

use super::{error::WebResult, middleware::guest};
use axum::{extract::State, middleware, response::IntoResponse, routing::get, Router};
use tower_cookies::{
    cookie::{
        time::{Duration, OffsetDateTime},
        CookieBuilder,
    },
    Cookies,
};

mod user;

pub const JWT_COOKIE: &str = "blend_jwt";
pub const CSRF_COOKIE: &str = "blend_csrf";

pub fn router(ctx: Context) -> Router {
    Router::new()
        .route("/", get(root))
        .route_layer(middleware::from_fn(guest::middleware))
        .with_state(ctx.clone())
        .merge(user::router(ctx))
}

async fn root() -> WebResult<impl IntoResponse> {
    Ok("root")
}
