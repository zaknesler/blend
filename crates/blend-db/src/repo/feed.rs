use crate::{error::DbResult, model};
use chrono::{DateTime, Utc};

pub struct FeedRepo {
    db: sqlx::SqlitePool,
}

pub struct CreateFeedParams {
    pub id: String,
    pub title: Option<String>,
    pub url_feed: Option<String>,
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

    pub async fn get_feed(&self, uuid: uuid::Uuid) -> DbResult<Option<model::Feed>> {
        sqlx::query_as::<_, model::Feed>("SELECT * FROM feeds WHERE uuid = ?1")
            .bind(uuid)
            .fetch_optional(&self.db)
            .await
            .map_err(|err| err.into())
    }

    pub async fn create_feed(&self, data: CreateFeedParams) -> DbResult<model::Feed> {
        let feed = sqlx::query_as::<_, model::Feed>(
            r#"
            INSERT INTO feeds (uuid, id, url_feed, title, published_at, updated_at)
            VALUES (?1, ?2, ?3, ?4, ?5, ?6)
            ON CONFLICT (id)
            DO UPDATE SET
                url_feed = excluded.url_feed,
                title = excluded.title,
                updated_at = excluded.updated_at
            RETURNING *
            "#,
        )
        .bind(uuid::Uuid::new_v4())
        .bind(data.id)
        .bind(data.url_feed)
        .bind(data.title)
        .bind(data.published_at)
        .bind(data.updated_at)
        .fetch_one(&self.db)
        .await?;

        Ok(feed)
    }
}
