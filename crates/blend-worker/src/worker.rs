use crate::{error::WorkerResult, Job};
use std::sync::{Arc, Mutex};
use tokio::sync::broadcast;

pub struct Worker {
    blend: blend_config::Config,
    db: sqlx::SqlitePool,
    recv: Arc<Mutex<broadcast::Receiver<Job>>>,
}

impl Worker {
    pub fn new(
        blend: blend_config::Config,
        db: sqlx::SqlitePool,
        recv: broadcast::Receiver<Job>,
    ) -> Self {
        Self {
            blend,
            db,
            recv: Arc::new(Mutex::new(recv)),
        }
    }

    pub async fn start(&mut self) -> WorkerResult<()> {
        let mut rx = self.recv.lock().unwrap();

        while let Ok(job) = rx.recv().await {
            dbg!(&job);
        }

        Ok(())
    }
}
