pub type WebResult<T> = Result<T, WebError>;

#[derive(thiserror::Error, Debug)]
pub enum WebError {
    #[error("resource not found")]
    NotFoundError,

    #[error("unauthorized")]
    UnauthorizedError,

    #[error(transparent)]
    AddrParseError(#[from] std::net::AddrParseError),

    #[error(transparent)]
    InvalidHeaderValueError(#[from] axum::http::header::InvalidHeaderValue),

    #[error(transparent)]
    JsonError(#[from] serde_json::Error),

    #[error(transparent)]
    IOError(#[from] std::io::Error),

    #[error(transparent)]
    SqlError(#[from] sqlx::Error),

    #[error(transparent)]
    ValidationError(#[from] validator::ValidationError),

    #[error(transparent)]
    ValidationErrorMap(#[from] validator::ValidationErrors),

    #[error(transparent)]
    CryptoError(#[from] blend_crypto::error::CryptoError),

    #[error(transparent)]
    DbError(#[from] blend_db::error::DbError),

    #[error(transparent)]
    FeedError(#[from] blend_feed::error::FeedError),

    #[error(transparent)]
    WorkerJobSendError(#[from] tokio::sync::broadcast::error::SendError<blend_worker::Job>),
}
