use blend_db::model;
use serde::Serialize;
use std::fmt::Display;

#[derive(Debug, Clone, Serialize)]
#[serde(tag = "type")]
pub enum Job {
    RefreshFeed(model::Feed),
    FetchMetadata(model::Feed),
    FetchEntries(model::Feed),
}

impl Display for Job {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Job::RefreshFeed(feed) => write!(
                f,
                "[job: refresh feed] (size = {}) feed = {}",
                std::mem::size_of_val(self),
                feed.uuid.hyphenated().to_string()
            ),
            Job::FetchMetadata(feed) => write!(
                f,
                "[job: fetch metadata] (size = {}) feed = {}",
                std::mem::size_of_val(self),
                feed.uuid.hyphenated().to_string()
            ),
            Job::FetchEntries(feed) => write!(
                f,
                "[job: fetch entries] (size = {}) feed = {}",
                std::mem::size_of_val(self),
                feed.uuid.hyphenated().to_string()
            ),
        }
    }
}
