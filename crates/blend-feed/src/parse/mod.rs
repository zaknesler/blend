use self::url::ParsedUrl;
use crate::error::{FeedError, FeedResult};

pub(crate) mod entry;
pub(crate) mod feed;
pub(crate) mod url;

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
    let data = reqwest::get(url).await?.text().await?;
    let feed = feed_rs::parser::parse_with_uri(data.as_bytes(), Some(base_url))?;

    Ok(feed)
}
