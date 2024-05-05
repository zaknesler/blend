use serde::Serialize;

pub mod entry;
pub mod feed;

#[derive(Debug, Clone, Serialize)]
pub struct Paginated<T> {
    data: T,
    next_cursor: Option<uuid::Uuid>,
}
