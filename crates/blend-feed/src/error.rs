pub(crate) type FeedResult<T> = Result<T, FeedError>;

#[derive(thiserror::Error, Debug)]
pub enum FeedError {
    #[error("invalid url: {0}")]
    InvalidUrl(String),

    #[error(transparent)]
    Io(#[from] std::io::Error),

    #[error(transparent)]
    RequestError(#[from] reqwest::Error),

    #[error(transparent)]
    UrlParseError(#[from] url::ParseError),

    #[error(transparent)]
    ParseFeedError(#[from] feed_rs::parser::ParseFeedError),
}
