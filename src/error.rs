pub type BlendResult<T> = Result<T, BlendError>;

#[derive(Debug, thiserror::Error)]
pub enum BlendError {
    #[error(transparent)]
    ConfigError(#[from] blend_config::error::ConfigError),

    #[error(transparent)]
    WebError(#[from] blend_web::error::WebError),
}
