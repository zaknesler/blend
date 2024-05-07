use crate::{error::WorkerResult, Notification};
use blend_db::{
    model::Feed,
    repo::entry::{CreateEntryParams, EntryRepo},
};
use blend_feed::parse_entries;
use sqlx::SqlitePool;
use std::sync::Arc;
use tokio::sync::{broadcast, Mutex};

pub async fn fetch_entries(
    feed: Feed,
    db: SqlitePool,
    notifs: Arc<Mutex<broadcast::Sender<Notification>>>,
) -> WorkerResult<()> {
    // Acquire lock to send initial notification, then release it while the entries are parsed & inserted
    {
        notifs.lock().await.send(Notification::FetchingEntries {
            feed_uuid: feed.uuid,
        })?;
    }

    let mapped = parse_entries(&feed.url_feed)
        .await?
        .into_iter()
        .map(|entry| CreateEntryParams {
            id: entry.id,
            url: entry.url,
            title: entry.title,
            summary: entry.summary,
            content_html: entry.content_html,
            published_at: entry.published_at,
            updated_at: entry.updated_at,
        })
        .collect::<Vec<_>>();

    let entry_uuids = EntryRepo::new(db).upsert_entries(&feed.uuid, &mapped).await?;

    notifs.lock().await.send(Notification::EntriesFetched {
        feed_uuid: feed.uuid,
        entry_uuids,
    })?;

    Ok(())
}
