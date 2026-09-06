use crate::{Notification, error::WorkerResult};
use blend_db::{model::Feed, repo::entry::EntryRepo};
use sqlx::SqlitePool;
use std::sync::Arc;
use tokio::sync::{Mutex, broadcast};

/// Parse entries from a feed, and scrape content if necessary
pub async fn scrape_entries(
    feed: Feed,
    db: SqlitePool,
    notif_tx: Arc<Mutex<broadcast::Sender<Notification>>>,
) -> WorkerResult<()> {
    let repo = EntryRepo::new(db);
    let url = blend_feed::parse_url(&feed.url_site)?;

    // Fetch all entries that have no content and haven't been scraped yet
    let entries_to_scrape = repo.get_entries_to_scrape(&feed.uuid).await?;

    // Scrape the content for each URL and update in the DB
    for entry in entries_to_scrape {
        let content_scraped_html = blend_feed::scrape_entry(entry.url)
            .await?
            .map(|html| blend_feed::extract_html(&html, &url.base));
        repo.update_scraped_entry(&entry.uuid, content_scraped_html).await?;
    }

    // Notify that we've finished scraping for this feed
    notif_tx.lock().await.send(Notification::FinishedScrapingEntries {
        feed_uuid: feed.uuid,
    })?;

    Ok(())
}
