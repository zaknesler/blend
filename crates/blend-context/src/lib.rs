use blend_config::config::BlendConfig;
use sqlx::SqlitePool;

#[derive(Debug, Clone)]
pub struct Context {
    pub blend: BlendConfig,
    pub db: SqlitePool,
}
