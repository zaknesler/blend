#[macro_use]
extern crate lazy_static;

mod error;
pub use error::FeedError as Error;

pub mod model;
mod readability;
mod scrape;

mod parse;
pub use parse::{parse_entries, parse_feed};

mod extract;
pub use extract::{extract_html, extract_stylistic_html, extract_text};
