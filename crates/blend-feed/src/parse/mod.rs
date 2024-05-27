use crate::{
    error::{FeedError, FeedResult},
    util::make_request,
};

mod entry;
mod feed;
mod url;

pub use entry::*;
pub use feed::*;
pub use url::*;

/// Fetch and parse feed content with the trimmed URL, falling back to the result of the untrimmed URL
async fn get_feed(url: ParsedUrl) -> FeedResult<(feed_rs::model::Feed, String)> {
    // Try parsing the feed using the trimmed URL (we want to keep the saved URLs as clean as possible)
    match parse_feed_from_url(&url.trimmed, &url.base).await {
        Ok(feed) => Ok((feed, url.trimmed)),
        Err(
            ref _outer @ FeedError::ParseFeedError(
                ref _inner @ feed_rs::parser::ParseFeedError::ParseError(ref _err),
            ),
        ) => {
            // If we encountered a feed parse error specifically, retry the parsing once more
            let feed = parse_feed_from_url(&url.url, &url.base).await?;
            Ok((feed, url.url))
        }
        Err(err) => Err(err),
    }
}

async fn parse_feed_from_url(url: &str, base_url: &str) -> FeedResult<feed_rs::model::Feed> {
    let data = make_request(url).await?.text().await?;
    let feed = feed_rs::parser::Builder::new()
        .base_uri(Some(base_url))
        .build()
        .parse(data.as_bytes())?;

    Ok(feed)
}
