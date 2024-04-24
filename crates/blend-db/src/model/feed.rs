use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;
use ts_rs::TS;

#[derive(TS)]
#[ts(export, export_to = "../../../ui/src/types/bindings/feed.ts")]
#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Feed {
    pub id: i64,
    pub url: Option<String>,
    pub title: Option<String>,
    pub published_at: Option<NaiveDateTime>,
    pub updated_at: Option<NaiveDateTime>,
}
