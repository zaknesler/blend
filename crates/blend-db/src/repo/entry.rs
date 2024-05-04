use crate::{error::DbResult, model};
use chrono::{DateTime, Utc};
use sqlx::{QueryBuilder, Row, Sqlite};

pub struct EntryRepo {
    db: sqlx::SqlitePool,
}

pub struct CreateEntryParams {
    pub id: String,
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

    pub async fn get_entries(&self) -> DbResult<Vec<model::Entry>> {
        sqlx::query_as::<_, model::Entry>(
            r#"
            SELECT uuid, feed_uuid, id, url, title, summary, published_at, updated_at
            FROM entries
            ORDER BY published_at DESC
            "#,
        )
        .fetch_all(&self.db)
        .await
        .map_err(|err| err.into())
    }

    pub async fn get_entries_for_feed(
        &self,
        feed_uuid: &uuid::Uuid,
    ) -> DbResult<Vec<model::Entry>> {
        sqlx::query_as::<_, model::Entry>(
            r#"
            SELECT uuid, feed_uuid, id, url, title, summary, published_at, updated_at
            FROM entries
            WHERE feed_uuid = ?1
            ORDER BY published_at DESC
            "#,
        )
        .bind(feed_uuid)
        .fetch_all(&self.db)
        .await
        .map_err(|err| err.into())
    }

    pub async fn get_entry(&self, entry_uuid: &uuid::Uuid) -> DbResult<Option<model::Entry>> {
        sqlx::query_as::<_, model::Entry>("SELECT * FROM entries WHERE uuid = ?1  LIMIT 1")
            .bind(entry_uuid)
            .fetch_optional(&self.db)
            .await
            .map_err(|err| err.into())
    }

    pub async fn insert_entries(
        &self,
        feed_uuid: &uuid::Uuid,
        entries: &[CreateEntryParams],
    ) -> DbResult<Vec<uuid::Uuid>> {
        let mut query = QueryBuilder::<Sqlite>::new("INSERT INTO entries (feed_uuid, uuid, id, url, title, summary, content_html, published_at, updated_at) ");
        query.push_values(entries.iter(), |mut b, entry| {
            b.push_bind(feed_uuid)
                .push_bind(uuid::Uuid::new_v4())
                .push_bind(entry.id.clone())
                .push_bind(entry.url.clone())
                .push_bind(entry.url.clone())
                .push_bind(entry.title.clone())
                .push_bind(entry.summary.clone())
                .push_bind(entry.content_html.clone())
                .push_bind(entry.published_at)
                .push_bind(entry.updated_at);
        });
        query.push(
            r#"
            ON CONFLICT (feed_uuid, id)
            DO UPDATE SET
                url = excluded.url,
                title = excluded.title,
                summary = excluded.summary,
                content_html = excluded.content_html,
                updated_at = excluded.updated_at
            RETURNING uuid
            "#,
        );

        query
            .build()
            .fetch_all(&self.db)
            .await?
            .into_iter()
            .map(|row| row.try_get("uuid").map_err(|err| err.into()))
            .collect::<DbResult<Vec<uuid::Uuid>>>()
    }
}
