use crate::{error::WorkerResult, Job};
use std::{collections::VecDeque, sync::Arc};
use tokio::sync::{broadcast, Mutex};

#[derive(Debug, Clone)]
pub struct Worker {
    db: sqlx::SqlitePool,
    jobs: Arc<Mutex<broadcast::Sender<Job>>>,
    queue: Arc<Mutex<VecDeque<Job>>>,
}

impl Worker {
    pub fn new(db: sqlx::SqlitePool, jobs: Arc<Mutex<broadcast::Sender<Job>>>) -> Self {
        Self {
            db,
            jobs,
            queue: Arc::new(Mutex::new(VecDeque::new())),
        }
    }

    pub async fn start(&mut self) -> WorkerResult<()> {
        // Spawn task to process jobs
        let db = self.db.clone();
        let queue = self.queue.clone();
        tokio::task::spawn(process_jobs(db, queue));

        // Wait for jobs to add to the queue
        let mut rx = self.jobs.lock().await.subscribe();
        while let Ok(job) = rx.recv().await {
            tracing::info!("job queued: {}", &job);
            let mut queue = self.queue.lock().await;
            queue.push_back(job);
        }

        Ok(())
    }
}

async fn process_jobs(db: sqlx::SqlitePool, queue: Arc<Mutex<VecDeque<Job>>>) {
    tracing::info!("waiting for jobs...");

    loop {
        let mut q = queue.lock().await;

        while let Some(job) = q.pop_front() {
            drop(q);

            if let Err(_err) = handle_job(job, db.clone()).await {
                // oh no!
            }

            q = queue.lock().await;
        }

        drop(q);

        // Add a delay before rechecking the queue to avoid busy-waiting
        tokio::time::sleep(std::time::Duration::from_millis(1000)).await;
    }
}

async fn handle_job(job: Job, db: sqlx::SqlitePool) -> WorkerResult<()> {
    //

    Ok(())
}
