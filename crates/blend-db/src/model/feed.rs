use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;
use ts_rs::TS;
use uuid::Uuid;

#[derive(TS)]
#[ts(export, export_to = "../../../ui/src/types/bindings/feed.ts")]
#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Feed {
    pub uuid: Uuid,
    pub url: Option<String>,
    pub title: Option<String>,
    pub published_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
}
