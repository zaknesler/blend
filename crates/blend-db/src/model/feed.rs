use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(TS)]
#[ts(export, export_to = "../../../ui/src/types/bindings/feed.ts")]
#[derive(Debug, Serialize, Deserialize)]
pub struct Feed {
    pub id: i64,
    pub url: Option<String>,
    pub title: Option<String>,
    pub published_at: Option<String>,
    pub updated_at: Option<String>,
    // published_at: Option<chrono::DateTime<chrono::Utc>>,
    // updated_at: Option<chrono::DateTime<chrono::Utc>>,
    // entries: Vec<Entry>,
}
