use super::{get_feed, parse_url};
use crate::{error::FeedResult, extract::*, ParsedEntry};

/// How many characters should the summary be before we treat it as the content (if there is already no content)
const SWAP_THRESHOLD: usize = 100;

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

            let mut summary_html = entry
                .summary
                .as_ref()
                .map(|text| extract_stylistic_html(&text.content, &url.base));

            let mut content_html = entry
                .content
                .and_then(|content| content.body.map(|content| extract_html(&content, &url.base)));

            // Some feeds may return article content as the summary/teaser. If this is the case, we want to
            // swap the (empty) content with the summary, but only if it's a respectable length.
            if content_html.as_ref().map_or(true, |html| html.is_empty())
                && summary_html.as_ref().is_some_and(|summary| summary.len() > SWAP_THRESHOLD)
            {
                content_html = entry.summary.map(|text| extract_html(&text.content, &url.base));
                summary_html = None;
            }

            ParsedEntry {
                id: entry.id,
                url: entry.links.first().map(|link| link.href.clone()),
                title: entry.title.map(|text| extract_text(&text.content)),
                summary_html,
                content_html,
                media_url,
                published_at: entry.published,
                updated_at: entry.updated,
            }
        })
        .collect::<Vec<ParsedEntry>>();

    Ok(entries)
}
