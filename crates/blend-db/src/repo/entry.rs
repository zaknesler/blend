use crate::{error::DbResult, model};
use chrono::{DateTime, Utc};

pub struct EntryRepo {
    db: sqlx::SqlitePool,
}

pub struct CreateEntryParams {
    pub url: Option<String>,
    pub title: Option<String>,
    pub summary: Option<String>,
    pub content_html: Option<String>,
    pub published_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
}

impl EntryRepo {
    pub fn new(db: sqlx::SqlitePool) -> Self {
        Self { db }
    }

    pub async fn get_entries_for_feed(
        &self,
        feed_uuid: &uuid::Uuid,
    ) -> DbResult<Vec<model::Entry>> {
        sqlx::query_as::<_, model::Entry>("SELECT * FROM entries WHERE feed_uuid = ?1")
            .bind(feed_uuid.hyphenated().to_string())
            .fetch_all(&self.db)
            .await
            .map_err(|err| err.into())
    }

    pub async fn insert_entry(
        &self,
        feed_uuid: &uuid::Uuid,
        entry: CreateEntryParams,
    ) -> DbResult<model::Entry> {
        sqlx::query_as::<_, model::Entry>(
            r#"
            INSERT INTO entries
            (feed_uuid, uuid, url, title, summary, content_html, published_at, updated_at)
            VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)
            RETURNING *
            "#,
        )
        .bind(feed_uuid.hyphenated().to_string())
        .bind(uuid::Uuid::new_v4().hyphenated().to_string())
        .bind(entry.url)
        .bind(entry.title)
        .bind(entry.summary)
        .bind(entry.content_html)
        .bind(entry.published_at)
        .bind(entry.updated_at)
        .fetch_one(&self.db)
        .await
        .map_err(|err| err.into())
    }
}
