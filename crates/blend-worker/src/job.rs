use blend_db::model;
use serde::Serialize;
use std::fmt::{format, Display};

#[derive(Debug, Clone, Serialize)]
#[serde(tag = "type")]
pub enum Job {
    RefreshFeed(model::Feed),
    FetchMetadata(model::Feed),
    FetchEntries(model::Feed),
}

impl Display for Job {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let mut write_job_str = |name: &str, uuid: uuid::Uuid| {
            write!(
                f,
                "[job: {}] (size = {}) feed = {}",
                name,
                std::mem::size_of_val(self),
                uuid.hyphenated().to_string()
            )
        };

        match self {
            Job::RefreshFeed(feed) => write_job_str("refresh feed", feed.uuid),
            Job::FetchEntries(feed) => write_job_str("fetch entries", feed.uuid),
            Job::FetchMetadata(feed) => write_job_str("fetch metadata", feed.uuid),
        }
    }
}
