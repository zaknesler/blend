use chrono::{DateTime, Utc};

/// Intermediate model for mapping/tweaking feeds from feed-rs.
#[derive(Debug, Clone)]
pub struct ParsedFeed {
    pub id: String,
    pub url_feed: String,
    pub url_site: String,
    pub title: Option<String>,
    pub favicon_url: Option<String>,
    pub published_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
}

/// Intermediate model for mapping/tweaking entries from feed-rs.
#[derive(Debug, Clone)]
pub struct ParsedEntry {
    pub id: String,
    pub url: Option<String>,
    pub title: Option<String>,
    pub summary_html: Option<String>,
    pub content_html: Option<String>,
    pub media_url: Option<String>,
    pub published_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
}
