use self::error::WebResult;
use axum::http::{header, HeaderValue, Method};
use tokio::net::TcpListener;
use tower_cookies::CookieManagerLayer;
use tower_http::{
    compression::{predicate::SizeAbove, CompressionLayer},
    cors,
    trace::TraceLayer,
    CompressionLevel,
};

mod context;
mod error;
mod middleware;
mod response;
mod router;
mod util;

pub use context::Context;
pub use error::WebError as Error;

pub async fn serve(ctx: context::Context) -> WebResult<()> {
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
        let origins = origins
            .iter()
            .map(|origin| origin.parse::<HeaderValue>().map_err(|err| err.into()))
            .collect::<WebResult<Vec<_>>>()?;

        cors = cors.allow_origin(origins).allow_credentials(true);
    }

    let app = crate::router::router(ctx.clone())
        .layer(cors)
        .layer(
            CompressionLayer::new()
                .quality(CompressionLevel::Precise(4))
                .compress_when(SizeAbove::new(512)),
        )
        .layer(CookieManagerLayer::new())
        .layer(TraceLayer::new_for_http());

    let addr = format!(
        "{}:{}",
        ctx.blend.config.web.host, ctx.blend.config.web.port
    );

    axum::serve(TcpListener::bind(addr).await?, app.into_make_service()).await?;

    Ok(())
}
