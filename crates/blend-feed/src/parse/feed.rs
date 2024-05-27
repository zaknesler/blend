use super::{get_feed, parse_url};
use crate::{error::FeedResult, extract::*, ParsedFeed};

// Fetch feed and process the basic feed data
pub async fn parse_feed(url: &str) -> FeedResult<ParsedFeed> {
    let url = parse_url(url)?;
    let url_feed = url.base.clone();

    // Parse feed and get URL that we used to scrape the content
    let (feed, url) = get_feed(url.clone()).await?;

    // Parse favicon URL to use until we can convert the remote image into binary data stored in the db
    let favicon_url = feed.icon.or_else(|| feed.logo).map(|image| image.uri);

    let parsed = ParsedFeed {
        id: feed.id,
        url_feed: url,
        url_site: url_feed,
        title: feed.title.map(|text| extract_text(&text.content)),
        favicon_url,
        published_at: feed.published,
        updated_at: feed.updated,
    };

    Ok(parsed)
}
