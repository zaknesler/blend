use error::FeedResult;
use model::{ParsedEntry, ParsedFeed};
use sanitize::{sanitize_html, sanitize_stylistic_html, sanitize_text};

mod error;
pub use error::FeedError as Error;

pub mod model;
mod sanitize;

/// Fetch feed and handle edge cases
async fn get_feed(url: &str) -> FeedResult<feed_rs::model::Feed> {
    let data = reqwest::get(url).await?.text().await?;
    let feed = feed_rs::parser::parse(data.as_bytes())?;

    Ok(feed)
}

// Fetch feed and process the basic feed data
pub async fn parse_feed(url: &str) -> FeedResult<ParsedFeed> {
    let feed = get_feed(url).await?;

    // Parse favicon URL to use until we can convert the remote image into binary data stored in the db
    let favicon_url = feed
        .icon
        .or_else(|| feed.logo)
        .map(|image| image.link.map(|link| link.href))
        .flatten();

    let parsed = ParsedFeed {
        id: feed.id,
        url: Some(url.to_owned()),
        title: feed.title.map(|text| sanitize_text(&text.content)),
        favicon_url,
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
                title: entry.title.map(|text| sanitize_text(&text.content)),
                summary_html: entry.summary.map(|text| sanitize_stylistic_html(&text.content)),
                content_html: entry
                    .content
                    .and_then(|content| content.body.map(|content| sanitize_html(&content))),
                published_at: entry.published,
                updated_at: entry.updated,
            }
        })
        .collect::<Vec<model::ParsedEntry>>();

    Ok(entries)
}
