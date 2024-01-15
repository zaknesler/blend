use serde::Serialize;
use ts_rs::TS;

#[derive(TS)]
#[ts(export)]
#[derive(Debug, Serialize)]
pub struct Feed {
    id: String,
    title: Option<String>,
    entries: Vec<Entry>,
}

#[derive(TS)]
#[ts(export)]
#[derive(Debug, Serialize)]
pub struct Entry {
    id: String,
    title: Option<String>,
    date: Option<chrono::DateTime<chrono::Utc>>,
}

impl From<feed_rs::model::Feed> for Feed {
    fn from(value: feed_rs::model::Feed) -> Self {
        Self {
            id: value.id,
            title: value.title.map(|value| value.content),
            entries: value
                .entries
                .into_iter()
                .map(|entry| Entry {
                    id: entry.id,
                    title: entry.title.map(|value| value.content),
                    date: entry.updated,
                })
                .collect::<Vec<_>>(),
        }
    }
}
