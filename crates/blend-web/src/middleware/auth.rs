use crate::{error::WebResult, router::JWT_COOKIE};
use axum::{body::Body, extract::State, http::Request, middleware::Next, response::IntoResponse};
use blend_crypto::jwt;
use tower_cookies::Cookies;

pub async fn middleware(
    cookies: Cookies,
    State(ctx): State<blend_context::Context>,
    req: Request<Body>,
    next: Next,
) -> WebResult<impl IntoResponse> {
    let user_id = cookies.get(JWT_COOKIE).and_then(|cookie| {
        jwt::verify_jwt(
            ctx.blend.config.crypto.jwt_signing_key.as_ref(),
            cookie.value(),
        )
        .ok()
    });

    // let user = match user_id {
    //     Some(value) => value, // todo: fetch user here
    //     None => {
    //         // Unset the JWT cookie if it isn't valid
    //         cookies.add(unset_cookie(JWT_COOKIE));
    //         return Ok(Redirect::to("/").into_response());
    //     }
    // };

    // let session = try_create_auth_session(ctx, user)
    //     .await
    //     .map_err(|_| WebError::UnauthorizedError)?;

    // req.extensions_mut().insert(session);

    Ok(next.run(req).await)
}
