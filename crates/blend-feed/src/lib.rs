#[macro_use]
extern crate lazy_static;

mod error;
mod extract;
pub mod model;
mod parse;
mod readability;
mod scrape;
pub(crate) mod util;

pub use error::FeedError as Error;
pub use extract::{extract_html, extract_stylistic_html, extract_text};
pub use parse::*;
pub use scrape::scrape_entry;
