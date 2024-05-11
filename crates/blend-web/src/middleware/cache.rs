use axum::{
    extract::Request,
    http::{
        header::{ACCEPT, CONTENT_TYPE},
        request, HeaderValue, Method, StatusCode,
    },
    middleware::{self, Next},
    response::Response,
    Router,
};

const MAX_AGE_HOURS: u32 = 24;
const CACHE_TYPES: [&str; 4] = [
    "text/css",
    "text/javascript",
    "application/javascript",
    "image/svg+xml",
];

pub async fn middleware(request: Request, next: Next) -> Response {
    let mut response = next.run(request).await;

    if let Some(content_type) = response.headers().get(CONTENT_TYPE) {
        if CACHE_TYPES.iter().any(|&ct| content_type == ct) {
            let value = format!("public, max-age={}", MAX_AGE_HOURS * 60 * 60);

            if let Ok(value) = HeaderValue::from_str(&value) {
                response.headers_mut().insert("cache-control", value);
            }
        }
    }

    response
}
