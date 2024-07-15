use crate::{error::DbResult, model, Error};
use serde::Serialize;
use sqlx::{QueryBuilder, Row, Sqlite};
use typeshare::typeshare;

pub struct FolderRepo {
    db: sqlx::SqlitePool,
}

pub struct CreateFolderParams {
    pub label: String,
    pub slug: String,
}

#[typeshare]
#[derive(Debug, Clone, Serialize)]
pub struct FolderFeedMap {
    pub uuid: uuid::Uuid,
    pub slug: String,
    pub label: String,
    pub feed_uuids: Vec<uuid::Uuid>,
}

impl FolderRepo {
    pub fn new(db: sqlx::SqlitePool) -> Self {
        Self { db }
    }

    pub async fn get_folders(&self) -> DbResult<Vec<model::Folder>> {
        sqlx::query_as::<_, model::Folder>("SELECT * FROM folders ORDER BY label ASC")
            .fetch_all(&self.db)
            .await
            .map_err(|err| err.into())
    }

    pub async fn create_folder(&self, data: CreateFolderParams) -> DbResult<model::Folder> {
        let feed = sqlx::query_as::<_, model::Folder>(
            r#"
            INSERT INTO folders (uuid, label, slug)
            VALUES (?1, ?2, ?3)
            RETURNING *
            "#,
        )
        .bind(uuid::Uuid::new_v4())
        .bind(data.label)
        .bind(data.slug)
        .fetch_one(&self.db)
        .await?;

        Ok(feed)
    }

    pub async fn get_folder_by_slug(&self, slug: &str) -> DbResult<Option<model::Folder>> {
        sqlx::query_as::<_, model::Folder>("SELECT * FROM folders WHERE slug ?1 ORDER BY label ASC")
            .bind(slug)
            .fetch_optional(&self.db)
            .await
            .map_err(|err| err.into())
    }

    pub async fn delete_uuids_by_slug(&self, slug: &str) -> DbResult<bool> {
        let rows_affected = sqlx::query("DELETE FROM folders_feeds WHERE folder_uuid = (SELECT uuid FROM folders WHERE slug = ?1)")
            .bind(slug)
            .execute(&self.db)
            .await?.rows_affected();

        Ok(rows_affected > 0)
    }

    pub async fn insert_uuids_by_slug(
        &self,
        slug: &str,
        feed_uuids: &[uuid::Uuid],
    ) -> DbResult<Vec<uuid::Uuid>> {
        if feed_uuids.is_empty() {
            return Ok(vec![]);
        }

        let folder = self.get_folder_by_slug(slug).await?.ok_or(Error::ResourceNotFound)?;

        let mut query =
            QueryBuilder::<Sqlite>::new("INSERT INTO folders_feeds (folder_uuid, feed_uuid) ");

        query.push_values(feed_uuids.iter(), |mut b, uuid| {
            b.push_bind(folder.uuid).push_bind(uuid);
        });
        query.push("RETURNING feed_uuid");

        query
            .build()
            .fetch_all(&self.db)
            .await?
            .into_iter()
            .map(|row| row.try_get("feed_uuid").map_err(|err| err.into()))
            .collect::<DbResult<Vec<uuid::Uuid>>>()
    }

    pub async fn get_feed_uuids_by_folder(&self, slug: &str) -> DbResult<Vec<uuid::Uuid>> {
        let uuids = sqlx::query_as::<_, (uuid::Uuid,)>("SELECT feed_uuid FROM folders_feeds WHERE folder_uuid = (SELECT uuid FROM folders WHERE slug = ?1)")
            .bind(slug)
            .fetch_all(&self.db)
            .await?
            .into_iter()
            .map(|(feed_uuid,)| feed_uuid)
            .collect::<Vec<_>>();

        Ok(uuids)
    }

    pub async fn get_folders_with_uuids(&self) -> DbResult<Vec<FolderFeedMap>> {
        let folders = self.get_folders().await?;

        let connections = sqlx::query_as::<_, (uuid::Uuid, uuid::Uuid)>(
            "SELECT folder_uuid, feed_uuid FROM folders_feeds",
        )
        .fetch_all(&self.db)
        .await?;

        let results = folders
            .into_iter()
            .map(|folder| {
                let feed_uuids = connections
                    .iter()
                    .filter_map(|(folder_uuid, feed_uuid)| {
                        (folder_uuid == &folder.uuid).then(|| feed_uuid.to_owned())
                    })
                    .collect::<Vec<_>>();

                FolderFeedMap {
                    uuid: folder.uuid,
                    slug: folder.slug,
                    label: folder.label,
                    feed_uuids,
                }
            })
            .collect::<Vec<_>>();

        Ok(results)
    }
}
