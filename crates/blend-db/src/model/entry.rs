use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;
use typeshare::typeshare;
use uuid::Uuid;

#[typeshare]
#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Entry {
    pub uuid: Uuid,
    pub feed_uuid: Uuid,
    pub id: String,
    pub url: String,
    pub title: Option<String>,
    pub summary_html: Option<String>,
    #[sqlx(default)]
    pub content_html: Option<String>,
    #[sqlx(default)]
    pub content_scraped_html: Option<String>,
    pub media_url: Option<String>,
    pub published_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
    pub read_at: Option<DateTime<Utc>>,
    pub saved_at: Option<DateTime<Utc>>,
    pub scraped_at: Option<DateTime<Utc>>,
}
