use crate::{
    error::FeedResult,
    extract::*,
    model::{self, ParsedEntry, ParsedFeed},
    scrape,
};

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
    let favicon_url = feed.icon.or_else(|| feed.logo).map(|image| image.uri);

    let parsed = ParsedFeed {
        id: feed.id,
        url: Some(url.to_owned()),
        title: feed.title.map(|text| extract_text(&text.content)),
        favicon_url,
        published_at: feed.published,
        updated_at: feed.updated,
    };

    Ok(parsed)
}

/// Fetch feed and process each entry as needed
pub async fn parse_entries(url: &str) -> FeedResult<Vec<ParsedEntry>> {
    let feed = get_feed(url).await?;

    let mut entries = feed
        .entries
        .iter()
        .cloned()
        .map(|entry| {
            // TODO: Find the best link somehow? Maybe not always the first?
            let url = entry.links.first().map(|link| link.href.clone());

            let media_url = entry
                .media
                .first()
                .and_then(|media| media.content.first().and_then(|content| content.url.clone()))
                .map(|url| url.to_string());

            ParsedEntry {
                id: entry.id,
                url,
                title: entry.title.map(|text| extract_text(&text.content)),
                summary_html: entry.summary.map(|text| extract_stylistic_html(&text.content)),
                content_html: entry
                    .content
                    .and_then(|content| content.body.map(|content| extract_html(&content))),
                content_scraped_html: None,
                media_url,
                published_at: entry.published,
                updated_at: entry.updated,
            }
        })
        .collect::<Vec<model::ParsedEntry>>();

    // TODO: join em
    for entry in entries.iter_mut() {
        if entry.content_html.is_some() || entry.media_url.is_some() {
            continue;
        }

        if let Some(url) = entry.url.clone() {
            entry.content_scraped_html =
                scrape::scrape_entry(url).await?.map(|html| extract_html(&html));
        }
    }

    Ok(entries)
}
