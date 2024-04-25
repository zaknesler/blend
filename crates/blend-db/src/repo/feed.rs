use crate::{
    error::{DbError, DbResult},
    model,
};
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
        sqlx::query_as!(model::Feed, "SELECT * FROM feeds")
            .fetch_all(&self.ctx.db)
            .await
            .map_err(|err| err.into())
    }

    pub async fn get_feed(&self, id: i64) -> DbResult<Option<model::Feed>> {
        sqlx::query_as!(model::Feed, "SELECT * FROM feeds WHERE id = ?1", id)
            .fetch_optional(&self.ctx.db)
            .await
            .map_err(|err| err.into())
    }

    pub async fn create_feed(&self, data: CreateFeedParams) -> DbResult<model::Feed> {
        let mut conn = self.ctx.db.acquire().await?;

        let id: i64 = sqlx::query!(
            r#"
            INSERT INTO feeds ( title, url, published_at, updated_at )
            VALUES ( ?1, ?2, ?3, ?4 )
            "#,
            data.title,
            data.url,
            data.published_at,
            data.updated_at,
        )
        .execute(&mut *conn)
        .await?
        .last_insert_rowid();

        let feed = self
            .get_feed(id)
            .await?
            .ok_or_else(|| DbError::CouldNotFindInsertedRow)?;

        Ok(feed)
    }
}
