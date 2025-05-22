use axum::{Router, middleware};
use axum_embed::ServeEmbed;
use rust_embed::RustEmbed;

#[derive(RustEmbed, Clone)]
#[folder = "$CARGO_MANIFEST_DIR/../../ui/dist"]
struct UiAssets;

pub fn router() -> Router {
    let serve_assets = ServeEmbed::<UiAssets>::with_parameters(
        Some("index.html".into()),
        axum_embed::FallbackBehavior::Ok,
        Some("index.html".into()),
    );

    Router::new()
        .fallback_service(serve_assets)
        .layer(middleware::from_fn(crate::middleware::cache))
}
