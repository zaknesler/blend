use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;
use typeshare::typeshare;
use uuid::Uuid;

#[typeshare]
#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Feed {
    pub uuid: Uuid,
    pub id: String,
    pub url_feed: String,
    pub url_site: String,
    pub title: String,
    pub title_display: Option<String>,
    pub favicon_b64: Option<String>,
    pub favicon_url: Option<String>,
    pub published_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
}

#[typeshare]
#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct FeedStats {
    pub uuid: Uuid,
    pub count_total: u32,
    pub count_unread: u32,
    pub count_saved: u32,
}
