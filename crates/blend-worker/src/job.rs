use blend_db::model;
use serde::Serialize;
use std::fmt::Display;

#[derive(Debug, Clone, Serialize)]
#[serde(tag = "type")]
pub enum Job {
    FetchMetadata(model::Feed),
    FetchEntries(model::Feed),
}

impl Display for Job {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Job::FetchMetadata(feed) => write!(
                f,
                "[fetch metadata] feed {}",
                feed.uuid.hyphenated().to_string()
            ),
            Job::FetchEntries(feed) => write!(
                f,
                "[fetch entries] feed {}",
                feed.uuid.hyphenated().to_string()
            ),
        }
    }
}
