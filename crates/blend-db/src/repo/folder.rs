use crate::{error::DbResult, model};

pub struct FolderRepo {
    db: sqlx::SqlitePool,
}

pub struct CreateFolderParams {
    pub label: String,
    pub slug: String,
}

impl FolderRepo {
    pub fn new(db: sqlx::SqlitePool) -> Self {
        Self { db }
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

    pub async fn get_feed_uuids_by_folder(&self, slug: String) -> DbResult<Vec<uuid::Uuid>> {
        let uuids = sqlx::query_as::<_, (uuid::Uuid,)>("SELECT feed_uuid FROM folders_feeds WHERE folder_uuid = (SELECT uuid FROM folders WHERE slug = ?1)")
            .bind(slug)
            .fetch_all(&self.db)
            .await?
            .into_iter()
            .map(|(feed_uuid,)| feed_uuid)
            .collect::<Vec<_>>();

        Ok(uuids)
    }
}
