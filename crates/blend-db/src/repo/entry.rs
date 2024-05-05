use super::Paginated;
use crate::{error::DbResult, model, PAGINATION_LIMIT};
use chrono::{DateTime, Utc};
use sqlx::{QueryBuilder, Row, Sqlite};
use uuid::Uuid;

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

#[derive(serde::Deserialize)]
pub struct FilterEntriesParams {
    #[serde(default = "FilterDirection::latest")]
    pub direction: FilterDirection,
    pub cursor: Option<Uuid>,
    pub feed: Option<Uuid>,
    pub unread: Option<bool>,
}

#[derive(serde::Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum FilterDirection {
    Asc,
    Desc,
}

impl FilterDirection {
    pub fn latest() -> Self {
        Self::Desc
    }

    pub fn query_elements(&self) -> (&str, &str) {
        match self {
            Self::Asc => ("ASC", ">"),
            Self::Desc => ("DESC", "<"),
        }
    }

    pub fn query_elements_inverse(&self) -> (&str, &str) {
        match self {
            Self::Asc => Self::query_elements(&Self::Desc),
            Self::Desc => Self::query_elements(&Self::Asc),
        }
    }
}

impl EntryRepo {
    pub fn new(db: sqlx::SqlitePool) -> Self {
        Self { db }
    }

    pub async fn get_paginated_entries(
        &self,
        filter: FilterEntriesParams,
    ) -> DbResult<Paginated<Vec<model::Entry>>> {
        let el = filter.direction.query_elements();
        let el_inv = filter.direction.query_elements_inverse();

        let mut query = QueryBuilder::<Sqlite>::new("SELECT uuid, feed_uuid, id, url, title, summary, published_at, updated_at, read_at FROM entries WHERE 1=1");

        // Optionally filter read_at status
        match filter.unread {
            Some(true) => query.push(" AND read_at IS NULL"),
            Some(false) => query.push(" AND read_at IS NOT NULL"),
            _ => query.push(""),
        };

        // Optionally filter by feed
        match filter.feed {
            Some(uuid) => query.push(" AND feed_uuid = ").push_bind(uuid),
            _ => query.push(""),
        };

        // Use the cursor to find the next batch of items, based on the published_at date and the rowid (opposite direction) as a fallback
        match filter.cursor {
            Some(uuid) => query
                .push(format!(
                    " AND published_at {} (SELECT published_at FROM entries WHERE uuid = ",
                    el.1
                ))
                .push_bind(uuid)
                .push(")")
                .push(format!(
                    " OR (published_at IS NULL AND rowid {} (SELECT rowid FROM entries WHERE published_at IS NULL AND uuid = ",
                    el_inv.1
                ))
                .push_bind(uuid)
                .push("))"),
            _ => query.push(""),
        };

        // Sort by publish date, using the rowid as a fallback if no publish date exists
        // Fetch one more than required to check for more entries for the given query
        query.push(format!(
            " ORDER BY published_at {}, rowid {} LIMIT {}",
            el.0,
            el_inv.0,
            PAGINATION_LIMIT + 1
        ));

        let query = query.build_query_as::<model::Entry>();
        let mut entries = query.fetch_all(&self.db).await?;
        let mut last_item_uuid = None;

        // We want to return PAGINATION_LIMIT but need to know if there are more to show
        if entries.len() == PAGINATION_LIMIT + 1 {
            entries.pop();
            last_item_uuid = entries.last().map(|entry| entry.uuid);
        }

        Ok(Paginated {
            data: entries,
            next_cursor: last_item_uuid,
        })
    }

    pub async fn get_entry(&self, entry_uuid: &uuid::Uuid) -> DbResult<Option<model::Entry>> {
        sqlx::query_as::<_, model::Entry>("SELECT * FROM entries WHERE uuid = ?1 LIMIT 1")
            .bind(entry_uuid)
            .fetch_optional(&self.db)
            .await
            .map_err(|err| err.into())
    }

    pub async fn update_entry_as_read(&self, entry_uuid: &uuid::Uuid) -> DbResult<bool> {
        let rows_affected = sqlx::query("UPDATE entries SET read_at = ?1 WHERE uuid = ?2")
            .bind(Utc::now())
            .bind(entry_uuid)
            .execute(&self.db)
            .await?
            .rows_affected();

        Ok(rows_affected > 0)
    }

    pub async fn update_entry_as_unread(&self, entry_uuid: &uuid::Uuid) -> DbResult<bool> {
        let rows_affected = sqlx::query("UPDATE entries SET read_at = NULL WHERE uuid = ?1")
            .bind(entry_uuid)
            .execute(&self.db)
            .await?
            .rows_affected();

        Ok(rows_affected > 0)
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
