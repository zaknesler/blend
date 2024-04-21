use axum::Router;
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

    Router::new().nest_service("/", serve_assets)
}
