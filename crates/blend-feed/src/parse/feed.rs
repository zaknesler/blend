use super::{get_feed, parse_url};
use crate::{error::FeedResult, extract::*, ParsedFeed};

// Fetch feed and process the basic feed data
pub async fn parse_feed(url: &str) -> FeedResult<ParsedFeed> {
    let parsed_url = parse_url(url)?;

    // Parse feed and get URL that we used to scrape the content
    let (feed, url_feed) = get_feed(parsed_url.clone()).await?;

    // Parse favicon URL to use until we can convert the remote image into binary data stored in the db
    let favicon_url = feed.icon.or_else(|| feed.logo).map(|image| image.uri);

    // TODO: improve this to not use just the first link
    let url_site = feed.links.first().map(|link| link.href.clone()).unwrap_or(parsed_url.base);

    let parsed = ParsedFeed {
        id: feed.id,
        url_feed,
        url_site,
        title: feed.title.map(|text| extract_text(&text.content)),
        favicon_url,
        published_at: feed.published,
        updated_at: feed.updated,
    };

    Ok(parsed)
}
