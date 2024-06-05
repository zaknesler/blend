use super::Paginated;
use crate::{error::DbResult, model, PAGINATION_LIMIT};
use chrono::{DateTime, Utc};
use serde::Deserialize;
use sqlx::{QueryBuilder, Row, Sqlite};
use typeshare::typeshare;
use uuid::Uuid;

pub struct EntryRepo {
    db: sqlx::SqlitePool,
}

pub struct CreateEntryParams {
    pub id: String,
    pub url: Option<String>,
    pub title: Option<String>,
    pub summary_html: Option<String>,
    pub content_html: Option<String>,
    pub media_url: Option<String>,
    pub published_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
}

#[typeshare]
#[derive(Deserialize)]
pub struct FilterEntriesParams {
    pub cursor: Option<Uuid>,
    pub feed: Option<Uuid>,
    pub folder: Option<String>,
    #[serde(default = "SortDirection::latest")]
    pub sort: SortDirection,
    #[serde(default)]
    pub view: View,
}

#[typeshare]
#[derive(Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum SortDirection {
    Oldest,
    Newest,
}

#[typeshare]
#[derive(Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum View {
    All,
    Read,
    Unread,
    Saved,
}

impl Default for View {
    fn default() -> Self {
        Self::Unread
    }
}

impl SortDirection {
    pub fn latest() -> Self {
        Self::Newest
    }

    pub fn query_elements(&self) -> (&str, &str) {
        match self {
            Self::Oldest => ("ASC", ">"),
            Self::Newest => ("DESC", "<"),
        }
    }

    pub fn query_elements_inverse(&self) -> (&str, &str) {
        match self {
            Self::Oldest => Self::query_elements(&Self::Newest),
            Self::Newest => Self::query_elements(&Self::Oldest),
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
        let el = filter.sort.query_elements();
        let el_inv = filter.sort.query_elements_inverse();

        let mut query = QueryBuilder::<Sqlite>::new("SELECT uuid, feed_uuid, id, url, title, summary_html, media_url, published_at, updated_at, read_at, saved_at, scraped_at FROM entries WHERE 1=1");

        match filter.view {
            View::All => &mut query,
            View::Read => query.push(" AND read_at IS NOT NULL"),
            View::Unread => query.push(" AND read_at IS NULL"),
            View::Saved => query.push(" AND saved_at IS NOT NULL"),
        };

        if let Some(uuid) = filter.feed {
            query.push(" AND feed_uuid = ").push_bind(uuid);
        }

        if let Some(slug) = filter.folder {
            query
                .push(" AND feed_uuid IN (SELECT feed_uuid FROM folders INNER JOIN folders_feeds ON folders.id = folders_feeds.id WHERE folders.slug = ")
                .push_bind(slug)
                .push(")");
        }

        // Use the cursor to find the next batch of items, based on the published/updated date and the rowid (opposite direction) as a fallback
        match filter.cursor {
            Some(uuid) => query
                .push(" AND (")
                .push(format!(" COALESCE(COALESCE(published_at, updated_at) {} (SELECT COALESCE(published_at, updated_at) FROM entries WHERE uuid = ", el.1))
                    .push_bind(uuid)
                    .push("), 0)")
                .push(format!(" OR COALESCE(published_at IS NULL and updated_at IS NULL AND rowid {} (SELECT rowid FROM entries WHERE published_at IS NULL and updated_at IS NULL AND uuid = ", el_inv.1))
                    .push_bind(uuid)
                    .push("), 0)")
                .push(")"),
            _ => query.push(""),
        };

        query.push(format!(
            // Sort by published/updated date, using the rowid as a fallback if neither date exists
            " ORDER BY COALESCE(published_at, updated_at) {}, rowid {} LIMIT {}",
            el.0,
            el_inv.0,
            // Fetch one more than required to check for more entries for the given query
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

    pub async fn get_entries_to_scrape(
        &self,
        feed_uuid: &uuid::Uuid,
    ) -> DbResult<Vec<model::Entry>> {
        sqlx::query_as::<_, model::Entry>("SELECT * FROM entries WHERE feed_uuid = ?1 AND content_html IS NULL AND content_scraped_html IS NULL AND scraped_at IS NULL")
            .bind(feed_uuid)
            .fetch_all(&self.db)
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

    pub async fn update_entry_as_saved(&self, entry_uuid: &uuid::Uuid) -> DbResult<bool> {
        let rows_affected = sqlx::query("UPDATE entries SET saved_at = ?1 WHERE uuid = ?2")
            .bind(Utc::now())
            .bind(entry_uuid)
            .execute(&self.db)
            .await?
            .rows_affected();

        Ok(rows_affected > 0)
    }

    pub async fn update_entry_as_unsaved(&self, entry_uuid: &uuid::Uuid) -> DbResult<bool> {
        let rows_affected = sqlx::query("UPDATE entries SET saved_at = NULL WHERE uuid = ?1")
            .bind(entry_uuid)
            .execute(&self.db)
            .await?
            .rows_affected();

        Ok(rows_affected > 0)
    }

    pub async fn upsert_entries(
        &self,
        feed_uuid: &uuid::Uuid,
        entries: &[CreateEntryParams],
    ) -> DbResult<Vec<uuid::Uuid>> {
        if entries.is_empty() {
            return Ok(vec![]);
        }

        let mut query = QueryBuilder::<Sqlite>::new("INSERT INTO entries (feed_uuid, uuid, id, url, title, summary_html, content_html, media_url, published_at, updated_at) ");
        query.push_values(entries.iter(), |mut b, entry| {
            b.push_bind(feed_uuid)
                .push_bind(uuid::Uuid::new_v4())
                .push_bind(entry.id.clone())
                .push_bind(entry.url.clone())
                .push_bind(entry.title.clone())
                .push_bind(entry.summary_html.clone())
                .push_bind(entry.content_html.clone())
                .push_bind(entry.media_url.clone())
                .push_bind(entry.published_at)
                .push_bind(entry.updated_at);
        });
        query.push(
            r#"
            ON CONFLICT (feed_uuid, id)
            DO UPDATE SET
                url = excluded.url,
                title = excluded.title,
                summary_html = excluded.summary_html,
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

    pub async fn update_scraped_entry(
        &self,
        entry_uuid: &uuid::Uuid,
        content_scraped_html: Option<String>,
    ) -> DbResult<bool> {
        let rows_affected = sqlx::query(
            "UPDATE entries SET content_scraped_html = ?1, scraped_at = ?2 WHERE uuid = ?3",
        )
        .bind(content_scraped_html)
        .bind(Utc::now())
        .bind(entry_uuid)
        .execute(&self.db)
        .await?
        .rows_affected();

        Ok(rows_affected > 0)
    }
}
