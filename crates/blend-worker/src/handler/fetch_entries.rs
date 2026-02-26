use crate::{Job, Notification, error::WorkerResult};
use blend_db::{
    model::Feed,
    repo::entry::{CreateEntryData, EntryRepo},
};
use sqlx::SqlitePool;
use std::sync::Arc;
use tokio::sync::{Mutex, broadcast, mpsc};

/// Parse entries from a feed, and scrape content if necessary
pub async fn fetch_entries(
    feed: Feed,
    db: SqlitePool,
    job_tx: Arc<Mutex<mpsc::Sender<Job>>>,
    notif_tx: Arc<Mutex<broadcast::Sender<Notification>>>,
) -> WorkerResult<()> {
    // Parse any entries directly from the feed
    let mapped = blend_feed::parse_entries(&feed.url_feed)
        .await?
        .into_iter()
        .map(|entry| CreateEntryData {
            id: entry.id,
            url: entry.url,
            title: entry.title,
            summary_html: entry.summary_html,
            content_html: entry.content_html,
            media_url: entry.media_url,
            published_at: entry.published_at,
            updated_at: entry.updated_at,
        })
        .collect::<Vec<_>>();

    // Save any entries we've successfully scraped
    EntryRepo::new(db).upsert_entries(&feed.uuid, &mapped).await?;

    // Notify that we've finished a feed refresh
    notif_tx.lock().await.send(Notification::FinishedFeedRefresh {
        feed_uuid: feed.uuid,
    })?;

    // Initiate job to scrape entries
    job_tx.lock().await.send(Job::ScrapeEntries(feed)).await?;

    Ok(())
}
