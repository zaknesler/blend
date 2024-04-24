use self::error::WebResult;
use axum::http::{header, HeaderValue, Method};
use context::Context;
use tokio::net::TcpListener;
use tower_cookies::CookieManagerLayer;
use tower_http::{cors, trace::TraceLayer};

pub mod context;
pub mod error;
mod middleware;
mod response;
mod router;
mod util;

pub async fn serve(ctx: Context) -> WebResult<()> {
    tracing::info!(
        "Starting web server on {}:{}",
        ctx.blend.config.web.host,
        ctx.blend.config.web.port,
    );

    let mut cors = cors::CorsLayer::new()
        .allow_methods([Method::GET, Method::POST, Method::PATCH, Method::DELETE])
        .allow_headers([header::AUTHORIZATION, header::ACCEPT, header::CONTENT_TYPE]);

    let origins = &ctx.blend.config.web.allowed_origins;
    if origins.contains(&"*".to_string()) {
        cors = cors.allow_origin(cors::Any)
    } else {
        cors = cors
            .allow_origin(
                origins
                    .iter()
                    .map(|origin| origin.parse::<HeaderValue>().map_err(|err| err.into()))
                    .collect::<WebResult<Vec<_>>>()?,
            )
            .allow_credentials(true);
    }

    let app = crate::router::router(ctx.clone())
        .layer(TraceLayer::new_for_http())
        .layer(cors)
        .layer(CookieManagerLayer::new());

    axum::serve(
        TcpListener::bind(format!(
            "{}:{}",
            ctx.blend.config.web.host, ctx.blend.config.web.port
        ))
        .await?,
        app.into_make_service(),
    )
    .await?;

    Ok(())
}
