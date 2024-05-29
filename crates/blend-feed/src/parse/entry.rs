use super::{get_feed, parse_url};
use crate::{error::FeedResult, extract::*, ParsedEntry};

/// Number of characters after which we can just assume the summary is the content, without needing to guess that it's HTML
const MAX_SUMMARY_LENGTH: usize = 1000;

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
            // TODO: improve this to not use just the first link
            let media_url = entry
                .media
                .first()
                .and_then(|media| media.content.first().and_then(|content| content.url.clone()))
                .map(|url| url.to_string());

            // TODO: improve this to not use just the first link
            let entry_url = entry.links.first().map(|link| link.href.clone());

            // Use the entry/article URL as the base URL to replace relative links in the content,
            // otherwise fallback to the feed URL
            let base_url = entry_url.as_ref().unwrap_or(&url.base).as_str();

            let mut summary_html = entry
                .summary
                .as_ref()
                .map(|text| extract_stylistic_html(&text.content, base_url))
                .and_then(|val| (val.len() != 0).then_some(val));

            let mut content_html = entry
                .content
                .and_then(|content| content.body.map(|content| extract_html(&content, base_url)))
                .and_then(|val| (val.len() != 0).then_some(val));

            // Some feeds may return article content as the summary/teaser, so if it's likely HTML, let's swap these fields
            if content_html.is_none()
                && summary_html
                    .as_ref()
                    .is_some_and(|value| value.len() >= MAX_SUMMARY_LENGTH || likely_html(value))
            {
                content_html = entry.summary.map(|text| extract_html(&text.content, base_url));
                summary_html = None;
            }

            ParsedEntry {
                id: entry.id,
                url: entry_url,
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
