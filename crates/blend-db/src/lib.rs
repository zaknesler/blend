pub mod client;
mod error;
pub mod model;
pub mod repo;

pub use error::DbError as Error;

const PAGINATION_LIMIT: usize = 20;
