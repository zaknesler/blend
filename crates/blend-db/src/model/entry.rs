use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;
use ts_rs::TS;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow, TS)]
#[ts(export, export_to = "../../../ui/src/types/bindings/entry.ts")]
pub struct Entry {
    pub uuid: Uuid,
    pub feed_uuid: Uuid,
    pub id: String,
    pub url: String,
    pub title: Option<String>,
    pub summary: Option<String>,
    #[sqlx(default)]
    pub content_html: Option<String>,
    #[sqlx(default)]
    pub content_scraped_html: Option<String>,
    pub published_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
    pub read_at: Option<DateTime<Utc>>,
}
