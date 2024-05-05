use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;
use ts_rs::TS;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow, TS)]
#[ts(export, export_to = "../../../ui/src/types/bindings/feed.ts")]
pub struct Feed {
    pub uuid: Uuid,
    pub id: String,
    pub url_feed: String,
    pub url_site: Option<String>,
    pub title: Option<String>,
    pub title_display: Option<String>,
    pub favicon_b64: Option<Vec<u8>>,
    pub published_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow, TS)]
#[ts(export, export_to = "../../../ui/src/types/bindings/stats.ts")]
pub struct FeedStats {
    pub uuid: Uuid,
    pub count_total: u32,
    pub count_unread: u32,
}
