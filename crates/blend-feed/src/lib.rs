#[macro_use]
extern crate lazy_static;

mod error;
mod extract;
mod model;
mod parse;
mod readability;
mod scrape;
pub(crate) mod util;

pub use error::FeedError as Error;
pub use extract::*;
pub use model::*;
pub use parse::*;
pub use scrape::scrape_entry;
