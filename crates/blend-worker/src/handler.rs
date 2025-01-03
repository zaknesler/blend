use crate::{error::WorkerResult, Job, Notification};
use base64::{engine::general_purpose::URL_SAFE, Engine as _};
use blend_db::{
    model::Feed,
    repo::{
        entry::{CreateEntryData, EntryRepo},
        feed::FeedRepo,
    },
};
use sqlx::SqlitePool;
use std::sync::Arc;
use tokio::sync::{broadcast, mpsc, Mutex};

/// Scrape favicon from feed site URL
pub async fn fetch_favicon(
    feed: Feed,
    db: SqlitePool,
    notif_tx: Arc<Mutex<broadcast::Sender<Notification>>>,
) -> WorkerResult<()> {
    // Don't refetch the favicon if we already have one saved
    if feed.favicon_b64.is_some() || feed.favicon_url.is_some() {
        return Ok(());
    }

    // Scrape favicon from site directly
    let url = url::Url::parse(&feed.url_site)?;
    let icon = tokio::task::block_in_place(|| favilib::Favicon::fetch(url, None))?;

    // Potentially save the image as a base64 PNG data string
    let data_string = icon
        .clone()
        .resize(favilib::ImageSize::Custom(64, 64))
        .change_format(favilib::ImageFormat::Png)
        .ok()
        .map(|icon| format!("data:image/png;base64,{}", URL_SAFE.encode(icon.bytes())));

    // Save favicon URL and the data string
    FeedRepo::new(db)
        .update_favicon(&feed.uuid, icon.url().to_string(), data_string)
        .await?;

    // Notify that we've saved the favicon
    notif_tx.lock().await.send(Notification::FinishedFetchingFeedFavicon {
        feed_uuid: feed.uuid,
    })?;

    Ok(())
}

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
