pub mod client;
mod error;
pub mod model;
pub mod repo;

const PAGINATION_LIMIT: usize = 20;

pub use error::DbError as Error;
