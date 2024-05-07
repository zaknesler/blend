use crate::{error::WorkerResult, handler, Job, Notification};
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
        // Use jobs as queue to spawn tasks for job processing
        while let Some(job) = self.jobs.recv().await {
            tracing::info!("{}", &job);

            // Spawn a new task to handle the job
            let db = self.db.clone();
            let notifs = self.notifs.clone();
            tokio::spawn(async move {
                if let Err(err) = handle_job(job.clone(), db, notifs).await {
                    tracing::error!("failed: {} with error: {}", job, err);
                }
            });
        }

        Ok(())
    }
}

async fn handle_job(
    job: Job,
    db: sqlx::SqlitePool,
    notifs: Arc<Mutex<broadcast::Sender<Notification>>>,
) -> WorkerResult<()> {
    match job {
        Job::FetchEntries(feed) => handler::fetch_entries(feed, db, notifs.clone()).await?,
        _ => {}
    };

    // TODO: handle errors cleanly (send error notification or something)

    Ok(())
}
