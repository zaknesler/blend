use blend_config::Config;
use sqlx::SqlitePool;
use std::sync::Arc;
use tokio::sync::{broadcast, mpsc, Mutex};

#[derive(Debug, Clone)]
pub struct Context {
    pub blend: Config,
    pub db: SqlitePool,
    pub jobs: Arc<Mutex<mpsc::Sender<blend_worker::Job>>>,
    pub notifs: Arc<Mutex<broadcast::Sender<blend_worker::Notification>>>,
}
