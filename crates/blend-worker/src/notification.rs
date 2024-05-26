use serde::Serialize;
use std::fmt::Display;
use typeshare::typeshare;

#[typeshare]
#[derive(Debug, Clone, Serialize)]
#[serde(tag = "type", content = "data")]
pub enum Notification {
    StartedFeedRefresh { feed_uuid: uuid::Uuid },
    FinishedFeedRefresh { feed_uuid: uuid::Uuid },
    FinishedFetchingFeedFavicon { feed_uuid: uuid::Uuid },
    FinishedScrapingEntries { feed_uuid: uuid::Uuid },
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
            Notification::FinishedFetchingFeedFavicon { feed_uuid } => write!(
                f,
                "[notification: finished fetching feed favicon] (size = {}) feed: {}",
                std::mem::size_of_val(self),
                feed_uuid.hyphenated(),
            ),
            Notification::FinishedScrapingEntries { feed_uuid } => write!(
                f,
                "[notification: finished scraping entries] (size = {}) feed: {}",
                std::mem::size_of_val(self),
                feed_uuid.hyphenated(),
            ),
        }
    }
}
