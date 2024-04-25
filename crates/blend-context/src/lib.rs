use blend_config::config::BlendConfig;
use sqlx::SqlitePool;

#[derive(Debug, Clone)]
pub struct Context {
    pub blend: BlendConfig,
    pub db: SqlitePool,
}

impl axum::extract::FromRef<Context> for () {
    fn from_ref(_: &Context) {}
}
