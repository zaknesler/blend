use error::FeedResult;
use model::{ParsedEntry, ParsedFeed};

mod error;
pub use error::FeedError as Error;
pub mod model;

/// Fetch feed and handle edge cases
async fn get_feed(url: &str) -> FeedResult<feed_rs::model::Feed> {
    let data = reqwest::get(url).await?.text().await?;
    let feed = feed_rs::parser::parse(data.as_bytes()).or_else(|err| match err {
        feed_rs::parser::ParseFeedError::ParseError(_) => todo!(), // fallback to URL and look for feed URL in <head>
        _ => Err(err),
    })?;

    Ok(feed)
}

// Fetch feed and process the basic feed data
pub async fn parse_feed(url: &str) -> FeedResult<ParsedFeed> {
    let feed = get_feed(url).await?;

    let parsed = ParsedFeed {
        id: feed.id,
        url: Some(url.to_owned()),
        title: feed.title.map(|title| title.content),
        favicon: None,
        published_at: feed.published,
        updated_at: feed.updated,
    };

    Ok(parsed)
}

/// Fetch feed and process each entry as needed
pub async fn parse_entries(url: &str) -> FeedResult<Vec<ParsedEntry>> {
    let feed = get_feed(url).await?;

    let entries = feed
        .entries
        .iter()
        .cloned()
        .map(|entry| {
            let link = entry
                .links
                .iter()
                .find(|link| link.rel.as_ref().is_some_and(|rel| rel == "self"));

            ParsedEntry {
                id: entry.id,
                url: link.map(|link| link.href.clone()), // TODO: normalize this url
                title: entry.title.map(|title| title.content),
                summary: entry.summary.map(|summary| summary.content),
                content_html: entry.content.and_then(|content| content.body), // TODO: normalize and sanitize this
                published_at: entry.published,
                updated_at: entry.updated,
            }
        })
        .collect::<Vec<model::ParsedEntry>>();

    Ok(entries)
}
