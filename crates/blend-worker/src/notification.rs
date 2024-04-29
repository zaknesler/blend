use serde::Serialize;
use std::fmt::Display;
use ts_rs::TS;

#[derive(Debug, Clone, Serialize, TS)]
#[serde(tag = "type")]
#[ts(export, export_to = "../../../ui/src/types/bindings/notification.ts")]
pub enum Notification {
    Test,
    StartedRefresh { feed_uuid: uuid::Uuid },
    FeedRefreshed { feed_uuid: uuid::Uuid },
}

impl Display for Notification {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Notification::Test => write!(
                f,
                "[notification: test] (size = {})",
                std::mem::size_of_val(self)
            ),
            Notification::StartedRefresh { feed_uuid } => write!(
                f,
                "[notification: started refresh] (size = {}) feed {}",
                std::mem::size_of_val(self),
                feed_uuid.hyphenated().to_string()
            ),
            Notification::FeedRefreshed { feed_uuid } => write!(
                f,
                "[notification: feed refreshed] (size = {}) feed {}",
                std::mem::size_of_val(self),
                feed_uuid.hyphenated().to_string()
            ),
        }
    }
}
