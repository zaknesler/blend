use crate::{error::WorkerResult, handler, Job, Notification};
use blend_db::repo;
use std::{sync::Arc, time::Duration};
use tokio::sync::{broadcast, mpsc, Mutex};

const REFRESH_INTERVAL_MINS: u64 = 30;

/// Refresh all feeds on an interval
pub async fn start_refresh_worker(
    jobs_tx: Arc<Mutex<mpsc::Sender<Job>>>,
    db: sqlx::SqlitePool,
) -> WorkerResult<()> {
    let mut interval = tokio::time::interval(Duration::from_secs(60 * REFRESH_INTERVAL_MINS));
    let repo = repo::feed::FeedRepo::new(db);

    // Allow the first tick to fire immediately
    tokio::time::Interval::tick(&mut interval).await;

    loop {
        for feed in repo.get_feeds().await? {
            let dispatcher = jobs_tx.lock().await;
            dispatcher.send(Job::FetchEntries(feed)).await?;
        }

        tokio::time::Interval::tick(&mut interval).await;
    }
}

/// Process jobs added to the job queue
pub async fn start_queue_worker(
    job_rx: &mut mpsc::Receiver<Job>,
    db: sqlx::SqlitePool,
    notifs: Arc<Mutex<broadcast::Sender<Notification>>>,
) -> WorkerResult<()> {
    while let Some(job) = job_rx.recv().await {
        tracing::info!("{}", &job);

        let db = db.clone();
        let notifs = notifs.clone();

        tokio::spawn(async move {
            if let Err(err) = handle_job(job.clone(), db, notifs).await {
                tracing::error!("!!failed: {} with error: {}", job, err);
            }
        });
    }

    Ok(())
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
