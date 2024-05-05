use crate::{error::WebResult, router::JWT_COOKIE};
use axum::{
    body::Body,
    http::Request,
    middleware::Next,
    response::{IntoResponse, Redirect},
};
use tower_cookies::Cookies;

pub async fn middleware(
    cookies: Cookies,
    req: Request<Body>,
    next: Next,
) -> WebResult<impl IntoResponse> {
    // If the user has a JWT (valid or not), redirect to the dashboard to let the auth middleware verify it
    // if cookies.get(JWT_COOKIE).is_some() {
    //     return Ok(Redirect::to("/").into_response());
    // }

    Ok(next.run(req).await)
}
