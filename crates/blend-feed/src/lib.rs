#[macro_use]
extern crate lazy_static;

mod error;
mod extract;
pub mod model;
mod parse;
mod readability;
mod scrape;
mod util;

pub use error::FeedError as Error;
pub use extract::*;
pub use parse::*;
pub use scrape::scrape_entry;
