use crate::error::{DbError, DbResult};
use blend_config::{config::BlendConfig, init_config_dir};
use sqlx::SqlitePool;
use std::fs::File;

pub async fn init(blend: BlendConfig) -> DbResult<SqlitePool> {
    let db_path = blend.dir.join(blend.config.database.file);
    let db_path_str = db_path.to_str().ok_or_else(|| DbError::InvalidDatabaseName)?;

    // Ensure config dir exists
    init_config_dir()?;

    // Ensure database file exists
    if !db_path.try_exists()? {
        File::create(db_path_str)?;
    }

    let pool = SqlitePool::connect(format!("sqlite:{}", db_path_str).as_ref()).await?;

    // Run migrations
    let mut db = pool.acquire().await?;
    sqlx::migrate!("./migrations").run(&mut db).await?;

    Ok(pool)
}
