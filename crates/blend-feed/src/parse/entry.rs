use super::get_feed;
use crate::{
    error::{FeedError, FeedResult},
    extract::*,
    model::{self, ParsedEntry},
    parse_url,
};

/// Fetch feed and process each entry as needed
pub async fn parse_entries(url: &str) -> FeedResult<Vec<ParsedEntry>> {
    let url = parse_url(url).ok_or_else(|| FeedError::InvalidUrl(url.to_string()))?;

    // Parse feed
    let (feed, _) = get_feed(url).await?;

    let entries = feed
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
                media_url,
                published_at: entry.published,
                updated_at: entry.updated,
            }
        })
        .collect::<Vec<model::ParsedEntry>>();

    Ok(entries)
}
