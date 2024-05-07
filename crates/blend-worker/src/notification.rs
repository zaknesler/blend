use serde::Serialize;
use std::fmt::Display;
use ts_rs::TS;

#[derive(Debug, Clone, Serialize, TS)]
#[serde(tag = "type")]
#[ts(export, export_to = "../../../ui/src/types/bindings/notification.ts")]
pub enum Notification {
    FetchingEntries {
        feed_uuid: uuid::Uuid,
    },
    EntriesFetched {
        feed_uuid: uuid::Uuid,
        entry_uuids: Vec<uuid::Uuid>,
    },
}

impl Display for Notification {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Notification::FetchingEntries { feed_uuid } => write!(
                f,
                "[notification: fetching entries] (size = {}) feed: {}",
                std::mem::size_of_val(self),
                feed_uuid.hyphenated().to_string()
            ),
            Notification::EntriesFetched {
                feed_uuid,
                entry_uuids,
            } => write!(
                f,
                "[notification: feed refreshed] (size = {}) feed: {}, entries: {}",
                std::mem::size_of_val(self),
                feed_uuid.hyphenated().to_string(),
                entry_uuids.len()
            ),
        }
    }
}
