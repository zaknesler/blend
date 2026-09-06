use serde::Serialize;

pub mod entry;
pub mod feed;
pub mod folder;

#[derive(Debug, Clone, Serialize)]
pub struct Paginated<T> {
    data: T,
    next_cursor: Option<uuid::Uuid>,
}
