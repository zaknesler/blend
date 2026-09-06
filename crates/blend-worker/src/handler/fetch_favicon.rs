use crate::{Notification, error::WorkerResult};
use base64::{Engine as _, engine::general_purpose::URL_SAFE};
use blend_db::{model::Feed, repo::feed::FeedRepo};
use sqlx::SqlitePool;
use std::sync::Arc;
use tokio::sync::{Mutex, broadcast};

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
