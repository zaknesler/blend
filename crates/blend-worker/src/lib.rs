pub mod error;
pub mod job;
use std::sync::{Arc, Mutex};

use error::WorkerResult;
pub use job::Job;
use tokio::sync::mpsc;

pub struct Worker {
    blend: blend_config::Config,
    recv: Arc<Mutex<mpsc::Receiver<Job>>>,
}

impl Worker {
    pub fn new(blend: blend_config::Config, recv: mpsc::Receiver<Job>) -> Self {
        Self {
            blend,
            recv: Arc::new(Mutex::new(recv)),
        }
    }

    pub async fn start(&mut self) -> WorkerResult<()> {
        let mut rx = self.recv.lock().unwrap();

        while let Some(job) = rx.recv().await {
            dbg!(&job);
        }

        Ok(())
    }
}
