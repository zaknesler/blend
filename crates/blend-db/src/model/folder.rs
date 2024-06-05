use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;
use typeshare::typeshare;
use uuid::Uuid;

#[typeshare]
#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Folder {
    pub id: String,
    pub slug: String,
    pub label: String,
    pub feed_uuids: Vec<Uuid>,
}
