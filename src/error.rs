pub type BlendResult<T> = Result<T, BlendError>;

#[derive(thiserror::Error, Debug)]
pub enum BlendError {
    #[error(transparent)]
    ConfigError(#[from] blend_config::error::ConfigError),

    #[error(transparent)]
    DatabaseError(#[from] blend_db::error::DbError),

    #[error(transparent)]
    WebError(#[from] blend_web::error::WebError),
}
