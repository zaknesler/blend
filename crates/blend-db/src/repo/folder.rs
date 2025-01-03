use crate::{error::DbResult, model};
use serde::Serialize;
use sqlx::{QueryBuilder, Row, Sqlite};
use typeshare::typeshare;

pub struct FolderRepo {
    db: sqlx::SqlitePool,
}

pub struct CreateFolderData {
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

    /// Get all folders.
    pub async fn get_folders(&self) -> DbResult<Vec<model::Folder>> {
        sqlx::query_as::<_, model::Folder>("SELECT * FROM folders ORDER BY label ASC")
            .fetch_all(&self.db)
            .await
            .map_err(|err| err.into())
    }

    /// Get a folder by its slug.
    pub async fn get_folder_by_slug(&self, slug: &str) -> DbResult<Option<model::Folder>> {
        sqlx::query_as::<_, model::Folder>("SELECT * FROM folders WHERE slug ?1 ORDER BY label ASC")
            .bind(slug)
            .fetch_optional(&self.db)
            .await
            .map_err(|err| err.into())
    }

    /// Get a folder by its UUID.
    pub async fn get_folder_by_uuid(&self, uuid: &uuid::Uuid) -> DbResult<Option<model::Folder>> {
        sqlx::query_as::<_, model::Folder>(
            "SELECT * FROM folders WHERE folder_uuid ?1 ORDER BY label ASC",
        )
        .bind(uuid)
        .fetch_optional(&self.db)
        .await
        .map_err(|err| err.into())
    }

    /// Get all feed UUIDs associated with a folder via its slug.
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

    /// Get a list of all folders with the UUIDs of its associated feeds.
    pub async fn get_folders_with_uuids(&self) -> DbResult<Vec<FolderFeedMap>> {
        let folders = self.get_folders().await?;

        // Fetch every folder-feed pair
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

    /// Create an empty folder.
    pub async fn create_folder(&self, data: CreateFolderData) -> DbResult<model::Folder> {
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

    /// Delete all all feeds associated with a folder by the folder's UUID.
    pub async fn delete_all_feeds_by_uuid(&self, uuid: &uuid::Uuid) -> DbResult<bool> {
        let rows_affected = sqlx::query("DELETE FROM folders_feeds WHERE folder_uuid = ?1")
            .bind(uuid)
            .execute(&self.db)
            .await?
            .rows_affected();

        Ok(rows_affected > 0)
    }

    /// Associate a list of feed UUIDs with a given folder via its UUID.
    pub async fn insert_feed_uuids_by_uuid(
        &self,
        uuid: &uuid::Uuid,
        feed_uuids: &[uuid::Uuid],
    ) -> DbResult<Vec<uuid::Uuid>> {
        if feed_uuids.is_empty() {
            return Ok(vec![]);
        }

        let mut query =
            QueryBuilder::<Sqlite>::new("INSERT INTO folders_feeds (folder_uuid, feed_uuid) ");

        // Bulk insert each folder-feed UUID pair
        query.push_values(feed_uuids.iter(), |mut b, folder_uuid| {
            b.push_bind(folder_uuid).push_bind(uuid);
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
}
