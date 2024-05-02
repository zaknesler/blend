#![allow(unused_variables, unused_imports, dead_code)]

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
        // Wait for jobs to process
        while let Some(job) = self.jobs.recv().await {
            tracing::info!("{}", &job);

            if let Err(err) = handle_job(job.clone(), self.db.clone(), self.notifs.clone()).await {
                tracing::error!("failed: {} with error: {}", job, err)
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
    match job {
        Job::FetchEntries(feed) => handler::fetch_entries(feed, db, notifs.clone()).await?,
        _ => {}
    };

    // TODO: handle errors cleanly (send error notification or something)

    Ok(())
}
