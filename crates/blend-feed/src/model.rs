use chrono::{DateTime, Utc};

#[derive(Debug, Clone)]
pub struct ParsedFeed {
    pub title: Option<String>,
    pub url: Option<String>,
    pub favicon: Option<String>,
    pub published_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
}

impl From<feed_rs::model::Feed> for ParsedFeed {
    fn from(value: feed_rs::model::Feed) -> Self {
        Self {
            url: None, // TODO: normalize a way of getting this URL, should fallback sanitized user-submitted URL
            title: value.title.map(|title| title.content),
            favicon: None,
            published_at: value.published,
            updated_at: value.updated,
        }
    }
}

#[derive(Debug, Clone)]
pub struct ParsedEntry {
    pub url: Option<String>,
    pub title: Option<String>,
    pub summary: Option<String>,
    pub content_html: Option<String>,
    pub published_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
}

impl From<feed_rs::model::Entry> for ParsedEntry {
    fn from(value: feed_rs::model::Entry) -> Self {
        let link = value
            .links
            .iter()
            .find(|link| link.rel.as_ref().is_some_and(|rel| rel == "self"));

        Self {
            url: link.map(|link| link.href.clone()), // TODO: normalize this url
            title: value.title.map(|title| title.content),
            summary: value.summary.map(|summary| summary.content),
            content_html: value.content.map(|content| content.body).flatten(), // TODO: normalize and sanitize this
            published_at: value.published,
            updated_at: value.updated,
        }
    }
}
