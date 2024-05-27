use super::{get_feed, parse_url};
use crate::{
    error::FeedResult,
    extract::*,
    model::{self, ParsedEntry},
};

/// Fetch feed and process each entry as needed
pub async fn parse_entries(url: &str) -> FeedResult<Vec<ParsedEntry>> {
    let url = parse_url(url)?;

    // Parse feed
    let (feed, _) = get_feed(url.clone()).await?;

    let entries = feed
        .entries
        .iter()
        .cloned()
        .map(|entry| {
            // TODO: Find the best link somehow? Maybe not always the first?
            let media_url = entry
                .media
                .first()
                .and_then(|media| media.content.first().and_then(|content| content.url.clone()))
                .map(|url| url.to_string());

            ParsedEntry {
                id: entry.id,
                url: entry.links.first().map(|link| link.href.clone()),
                title: entry.title.map(|text| extract_text(&text.content)),
                summary_html: entry
                    .summary
                    .map(|text| extract_stylistic_html(&text.content, &url.base)),
                content_html: entry.content.and_then(|content| {
                    content.body.map(|content| extract_html(&content, &url.base))
                }),
                media_url,
                published_at: entry.published,
                updated_at: entry.updated,
            }
        })
        .collect::<Vec<model::ParsedEntry>>();

    Ok(entries)
}
