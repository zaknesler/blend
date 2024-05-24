pub(crate) type FeedResult<T> = Result<T, FeedError>;

#[derive(thiserror::Error, Debug)]
pub enum FeedError {
    #[error(transparent)]
    Io(#[from] std::io::Error),

    #[error(transparent)]
    RequestError(#[from] reqwest::Error),

    #[error(transparent)]
    UrlParseError(#[from] url::ParseError),

    #[error("{0}")]
    ScrapeError(String),

    #[error(transparent)]
    ParseFeedError(#[from] feed_rs::parser::ParseFeedError),
}
