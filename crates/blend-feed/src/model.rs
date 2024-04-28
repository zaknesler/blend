use chrono::{DateTime, Utc};
use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
pub struct ParsedFeed {
    pub title: Option<String>,
    pub url: Option<String>,
    pub favicon: Option<String>,
    pub published_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
}

impl From<feed_rs::model::Feed> for ParsedFeed {
    fn from(value: feed_rs::model::Feed) -> Self {
        let link = value
            .links
            .iter()
            .find(|link| link.rel.as_ref().is_some_and(|rel| rel == "self"));

        Self {
            title: value.title.map(|title| title.content),
            favicon: None,
            url: link.map(|link| link.href.clone()),
            published_at: value.published,
            updated_at: value.updated,
        }
    }
}
