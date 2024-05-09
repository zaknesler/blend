use serde::Serialize;
use std::fmt::Display;
use ts_rs::TS;

#[derive(Debug, Clone, Serialize, TS)]
#[serde(tag = "type")]
#[ts(export, export_to = "../../../ui/src/types/bindings/notification.ts")]
pub enum Notification {
    StartedFeedRefresh {
        feed_uuid: uuid::Uuid,
    },
    FinishedFeedRefresh {
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
            Notification::StartedFeedRefresh { feed_uuid } => write!(
                f,
                "[notification: started feed refresh] (size = {}) feed: {}",
                std::mem::size_of_val(self),
                feed_uuid.hyphenated(),
            ),
            Notification::FinishedFeedRefresh { feed_uuid } => write!(
                f,
                "[notification: finished feed refresh] (size = {}) feed: {}",
                std::mem::size_of_val(self),
                feed_uuid.hyphenated(),
            ),
            Notification::EntriesFetched {
                feed_uuid,
                entry_uuids,
            } => write!(
                f,
                "[notification: entries fetched] (size = {}) feed: {}, entries: {}",
                std::mem::size_of_val(self),
                feed_uuid.hyphenated(),
                entry_uuids.len()
            ),
        }
    }
}
