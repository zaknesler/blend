use crate::{error::DbResult, model};
use chrono::{DateTime, Utc};

pub struct FeedRepo {
    ctx: blend_context::Context,
}

pub struct CreateFeedParams {
    pub title: Option<String>,
    pub url: Option<String>,
    pub published_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
}

impl FeedRepo {
    pub fn new(ctx: blend_context::Context) -> Self {
        Self { ctx }
    }

    pub async fn get_feeds(&self) -> DbResult<Vec<model::Feed>> {
        sqlx::query_as::<_, model::Feed>("SELECT * FROM feeds")
            .fetch_all(&self.ctx.db)
            .await
            .map_err(|err| err.into())
    }

    pub async fn get_feed(&self, uuid: uuid::Uuid) -> DbResult<Option<model::Feed>> {
        sqlx::query_as::<_, model::Feed>("SELECT * FROM feeds WHERE uuid = ?1")
            .bind(uuid)
            .fetch_optional(&self.ctx.db)
            .await
            .map_err(|err| err.into())
    }

    pub async fn create_feed(&self, data: CreateFeedParams) -> DbResult<model::Feed> {
        let feed = sqlx::query_as::<_, model::Feed>(
            r#"
            INSERT INTO feeds (uuid, title, url, published_at, updated_at)
            VALUES (?1, ?2, ?3, ?4, ?5)
            RETURNING *
            "#,
        )
        .bind(uuid::Uuid::new_v4())
        .bind(data.title)
        .bind(data.url)
        .bind(data.published_at)
        .bind(data.updated_at)
        .fetch_one(&self.ctx.db)
        .await?;

        Ok(feed)
    }
}
