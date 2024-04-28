pub type WorkerResult<T> = Result<T, WorkerError>;

#[derive(thiserror::Error, Debug)]
pub enum WorkerError {
    #[error(transparent)]
    Io(#[from] std::io::Error),

    #[error(transparent)]
    RequestError(#[from] reqwest::Error),
}
