use crate::{error::DbResult, model};
use chrono::{DateTime, Utc};

pub struct FeedRepo {
    db: sqlx::SqlitePool,
}

pub struct CreateFeedParams {
    pub id: String,
    pub title: String,
    pub url_feed: String,
    pub url_site: String,
    pub favicon_url: Option<String>,
    pub published_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
}

impl FeedRepo {
    pub fn new(db: sqlx::SqlitePool) -> Self {
        Self { db }
    }

    pub async fn get_feeds(&self) -> DbResult<Vec<model::Feed>> {
        sqlx::query_as::<_, model::Feed>("SELECT * FROM feeds")
            .fetch_all(&self.db)
            .await
            .map_err(|err| err.into())
    }

    pub async fn get_stats(&self) -> DbResult<Vec<model::FeedStats>> {
        sqlx::query_as::<_, model::FeedStats>(
            r#"
            SELECT
                feeds.uuid,
                COUNT(entries.uuid) as count_total,
                COUNT(CASE WHEN entries.read_at IS NULL THEN 1 ELSE NULL END) as count_unread,
                COUNT(CASE WHEN entries.saved_at IS NOT NULL THEN 1 ELSE NULL END) as count_saved
            FROM feeds
            INNER JOIN entries ON feeds.uuid = entries.feed_uuid
            GROUP BY feeds.uuid
            "#,
        )
        .fetch_all(&self.db)
        .await
        .map_err(|err| err.into())
    }

    pub async fn get_feed(&self, feed_uuid: uuid::Uuid) -> DbResult<Option<model::Feed>> {
        sqlx::query_as::<_, model::Feed>("SELECT * FROM feeds WHERE uuid = ?1")
            .bind(feed_uuid)
            .fetch_optional(&self.db)
            .await
            .map_err(|err| err.into())
    }

    pub async fn create_feed(&self, data: CreateFeedParams) -> DbResult<model::Feed> {
        let feed = sqlx::query_as::<_, model::Feed>(
            r#"
            INSERT INTO feeds (uuid, id, url_feed, url_site, title, favicon_url, published_at, updated_at)
            VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)
            ON CONFLICT (id)
            DO UPDATE SET
                url_feed = excluded.url_feed,
                url_site = excluded.url_site,
                title = excluded.title,
                favicon_url = excluded.favicon_url,
                updated_at = excluded.updated_at
            RETURNING *
            "#,
        )
        .bind(uuid::Uuid::new_v4())
        .bind(data.id)
        .bind(data.url_feed)
        .bind(data.url_site)
        .bind(data.title)
        .bind(data.favicon_url)
        .bind(data.published_at)
        .bind(data.updated_at)
        .fetch_one(&self.db)
        .await?;

        Ok(feed)
    }

    pub async fn update_favicon(
        &self,
        feed_uuid: &uuid::Uuid,
        favicon_url: String,
        favicon_base64: Option<String>,
    ) -> DbResult<bool> {
        let rows_affected =
            sqlx::query("UPDATE feeds SET favicon_url = ?1, favicon_b64 = ?2 WHERE uuid = ?3")
                .bind(favicon_url)
                .bind(favicon_base64)
                .bind(feed_uuid)
                .execute(&self.db)
                .await?
                .rows_affected();

        Ok(rows_affected > 0)
    }

    pub async fn update_feed_as_read(&self, feed_uuid: &uuid::Uuid) -> DbResult<bool> {
        let rows_affected = sqlx::query("UPDATE entries SET read_at = ?1 WHERE feed_uuid = ?2")
            .bind(Utc::now())
            .bind(feed_uuid)
            .execute(&self.db)
            .await?
            .rows_affected();

        Ok(rows_affected > 0)
    }
}
