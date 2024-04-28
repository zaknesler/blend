use blend_config::config::BlendConfig;
use sqlx::SqlitePool;
use std::sync::Arc;
use tokio::sync::{broadcast, Mutex};

#[derive(Debug, Clone)]
pub struct Context {
    pub blend: BlendConfig,
    pub db: SqlitePool,
    pub worker: Arc<Mutex<broadcast::Sender<blend_worker::Job>>>,
}