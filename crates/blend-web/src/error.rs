pub type WebResult<T> = Result<T, WebError>;

#[derive(thiserror::Error, Debug)]
pub enum WebError {
    #[error("invalid form data: {0}")]
    InvalidFormData(String),

    #[error("resource not found")]
    NotFoundError,

    #[error("unauthorized")]
    UnauthorizedError,

    #[error("invalid csrf")]
    CsrfInvalidError,

    #[error(transparent)]
    AddrParseError(#[from] std::net::AddrParseError),

    #[error(transparent)]
    ValidationError(#[from] validator::ValidationError),

    #[error(transparent)]
    ValidationErrors(#[from] validator::ValidationErrors),

    #[error(transparent)]
    InvalidHeaderValueError(#[from] axum::http::header::InvalidHeaderValue),

    #[error(transparent)]
    JsonError(#[from] serde_json::Error),

    #[error(transparent)]
    IOError(#[from] std::io::Error),

    #[error(transparent)]
    CryptoError(#[from] blend_crypto::error::CryptoError),
}
