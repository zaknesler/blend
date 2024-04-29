use crate::{error::WorkerResult, Job, Notification};
use std::sync::Arc;
use tokio::sync::{broadcast, mpsc, Mutex};

#[derive(Debug)]
pub struct Worker {
    db: sqlx::SqlitePool,
    jobs: mpsc::Receiver<Job>,
    notifs: Arc<Mutex<broadcast::Sender<Notification>>>,
}

impl Worker {
    pub fn new(
        db: sqlx::SqlitePool,
        jobs: mpsc::Receiver<Job>,
        notifs: Arc<Mutex<broadcast::Sender<Notification>>>,
    ) -> Self {
        Self { db, jobs, notifs }
    }

    pub async fn start(&mut self) -> WorkerResult<()> {
        // Wait for jobs to process
        while let Some(job) = self.jobs.recv().await {
            tracing::info!("{}", &job);

            if let Err(_err) = handle_job(job, self.db.clone(), self.notifs.clone()).await {
                // oh no!
            }
        }

        Ok(())
    }
}

async fn handle_job(
    job: Job,
    db: sqlx::SqlitePool,
    notifs: Arc<Mutex<broadcast::Sender<Notification>>>,
) -> WorkerResult<()> {
    // Send test notification
    notifs.lock().await.send(Notification::Test)?;

    Ok(())
}
