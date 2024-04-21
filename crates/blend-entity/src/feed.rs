use serde::Serialize;
use ts_rs::TS;

#[derive(TS)]
#[ts(export)]
#[derive(Debug, Serialize)]
pub struct Feed {
    id: String,
    title: Option<String>,
    published_at: Option<chrono::DateTime<chrono::Utc>>,
    updated_at: Option<chrono::DateTime<chrono::Utc>>,
    entries: Vec<Entry>,
}

#[derive(TS)]
#[ts(export)]
#[derive(Debug, Serialize)]
pub struct Entry {
    id: String,
    title: Option<String>,
    published_at: Option<chrono::DateTime<chrono::Utc>>,
    updated_at: Option<chrono::DateTime<chrono::Utc>>,
}

impl From<feed_rs::model::Feed> for Feed {
    fn from(value: feed_rs::model::Feed) -> Self {
        Self {
            id: value.id,
            title: value.title.map(|value| value.content),
            published_at: value.published,
            updated_at: value.updated,
            entries: value
                .entries
                .into_iter()
                .map(|entry| Entry {
                    id: entry.id,
                    title: entry.title.map(|value| value.content),
                    published_at: entry.published,
                    updated_at: entry.updated,
                })
                .collect::<Vec<_>>(),
        }
    }
}
