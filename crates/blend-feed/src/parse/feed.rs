use super::get_feed;
use crate::{
    error::{FeedError, FeedResult},
    extract::*,
    model::ParsedFeed,
    parse_url,
};

// Fetch feed and process the basic feed data
pub async fn parse_feed(url: &str) -> FeedResult<ParsedFeed> {
    let url = parse_url(url).ok_or_else(|| FeedError::InvalidUrl(url.to_string()))?;
    let (feed, url) = get_feed(url.clone()).await?;

    dbg!(&url);

    // Parse favicon URL to use until we can convert the remote image into binary data stored in the db
    let favicon_url = feed.icon.or_else(|| feed.logo).map(|image| image.uri);

    let parsed = ParsedFeed {
        id: feed.id,
        url,
        title: feed.title.map(|text| extract_text(&text.content)),
        favicon_url,
        published_at: feed.published,
        updated_at: feed.updated,
    };

    Ok(parsed)
}
