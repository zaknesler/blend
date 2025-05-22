use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;
use typeshare::typeshare;

#[typeshare]
#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Folder {
    pub uuid: uuid::Uuid,
    pub slug: String,
    pub label: String,
}
