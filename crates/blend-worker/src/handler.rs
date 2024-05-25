use crate::{error::WorkerResult, Job, Notification};
use blend_db::{
    model::Feed,
    repo::entry::{CreateEntryParams, EntryRepo},
};
use sqlx::SqlitePool;
use std::sync::Arc;
use tokio::sync::{broadcast, mpsc, Mutex};

/// Parse entries from a feed, and scrape content if necessary
pub async fn fetch_entries(
    feed: Feed,
    db: SqlitePool,
    job_tx: Arc<Mutex<mpsc::Sender<Job>>>,
    notif_tx: Arc<Mutex<broadcast::Sender<Notification>>>,
) -> WorkerResult<()> {
    let mapped = blend_feed::parse_entries(&feed.url_feed)
        .await?
        .into_iter()
        .map(|entry| CreateEntryParams {
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

    EntryRepo::new(db).upsert_entries(&feed.uuid, &mapped).await?;

    // Notify that we've finished a feed refresh
    notif_tx.lock().await.send(Notification::FinishedFeedRefresh {
        feed_uuid: feed.uuid,
    })?;

    // Initiate job to scrape entries
    job_tx.lock().await.send(Job::ScrapeEntries(feed)).await?;

    Ok(())
}

/// Parse entries from a feed, and scrape content if necessary
pub async fn scrape_entries(
    feed: Feed,
    db: SqlitePool,
    notif_tx: Arc<Mutex<broadcast::Sender<Notification>>>,
) -> WorkerResult<()> {
    let repo = EntryRepo::new(db);

    // Fetch all entries that have no content and haven't been scraped yet
    let entries_to_scrape = repo.get_entries_to_scrape(&feed.uuid).await?;

    // Scrape the content for each URL and update in the DB
    for entry in entries_to_scrape {
        let content_scraped_html = blend_feed::scrape_entry(entry.url)
            .await?
            .map(|html| blend_feed::extract_html(&html));
        repo.update_scraped_entry(&entry.uuid, content_scraped_html).await?;
    }

    // Notify that we've finished scraping for this feed
    notif_tx.lock().await.send(Notification::FinishedScrapingEntries {
        feed_uuid: feed.uuid,
    })?;

    Ok(())
}
