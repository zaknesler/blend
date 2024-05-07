use blend_db::model;
use serde::Serialize;
use std::fmt::Display;

#[derive(Debug, Clone, Serialize)]
#[serde(tag = "type")]
pub enum Job {
    FetchEntries(model::Feed),
    FetchMetadata(model::Feed),
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
            Job::FetchEntries(feed) => write_job_str("fetch entries", feed.uuid),
            Job::FetchMetadata(feed) => write_job_str("fetch metadata", feed.uuid),
        }
    }
}
