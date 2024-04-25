pub type ParseResult<T> = Result<T, ParseError>;

#[derive(thiserror::Error, Debug)]
pub enum ParseError {
    #[error(transparent)]
    Io(#[from] std::io::Error),

    #[error(transparent)]
    RequestError(#[from] reqwest::Error),

    #[error(transparent)]
    ParseFeedError(#[from] feed_rs::parser::ParseFeedError),
}
