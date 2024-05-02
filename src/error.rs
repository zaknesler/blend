pub type BlendResult<T> = Result<T, BlendError>;

#[derive(thiserror::Error, Debug)]
pub enum BlendError {
    #[error(transparent)]
    ConfigError(#[from] blend_config::Error),

    #[error(transparent)]
    DatabaseError(#[from] blend_db::Error),

    #[error(transparent)]
    WebError(#[from] blend_web::Error),

    #[error(transparent)]
    WorkerError(#[from] blend_worker::Error),
}
