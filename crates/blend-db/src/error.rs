pub(crate) type DbResult<T> = Result<T, DbError>;

#[derive(thiserror::Error, Debug)]
pub enum DbError {
    #[error("invalid database name")]
    InvalidDatabaseName,

    #[error("could not fetch row after insertion")]
    CouldNotFetchRowAfterInsertion,

    #[error(transparent)]
    SqlError(#[from] sqlx::Error),

    #[error(transparent)]
    MigrateError(#[from] sqlx::migrate::MigrateError),

    #[error(transparent)]
    IoError(#[from] std::io::Error),

    #[error(transparent)]
    ConfigError(#[from] blend_config::Error),
}
