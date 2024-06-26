use crate::error::{DbError, DbResult};
use blend_config::{init_config_dir, Config};
use sqlx::SqlitePool;
use std::fs::File;

pub async fn init(blend: Config) -> DbResult<SqlitePool> {
    let db_path = blend.dir.join(blend.config.database.file);
    let db_path_str = db_path.to_str().ok_or_else(|| DbError::InvalidDatabaseName)?;

    // Ensure config dir exists
    init_config_dir()?;

    // Ensure database file exists
    if !db_path.try_exists()? {
        tracing::info!("Creating database at {}", db_path_str);
        File::create(db_path_str)?;
    }

    let pool = SqlitePool::connect(format!("sqlite:{}", db_path_str).as_ref()).await?;

    // Run migrations
    let mut db = pool.acquire().await?;
    sqlx::migrate!("./migrations").run(&mut db).await?;

    Ok(pool)
}
