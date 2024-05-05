pub(crate) type FeedResult<T> = Result<T, FeedError>;

#[derive(thiserror::Error, Debug)]
pub enum FeedError {
    #[error(transparent)]
    Io(#[from] std::io::Error),

    #[error(transparent)]
    RequestError(#[from] reqwest::Error),

    #[error(transparent)]
    ParseFeedError(#[from] feed_rs::parser::ParseFeedError),
}
