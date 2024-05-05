pub(crate) type WorkerResult<T> = Result<T, WorkerError>;

#[derive(thiserror::Error, Debug)]
pub enum WorkerError {
    #[error(transparent)]
    Io(#[from] std::io::Error),

    #[error(transparent)]
    RequestError(#[from] reqwest::Error),

    #[error(transparent)]
    NotificationBroadcastSendError(
        #[from] tokio::sync::broadcast::error::SendError<crate::Notification>,
    ),

    #[error(transparent)]
    FeedError(#[from] blend_feed::Error),

    #[error(transparent)]
    DbError(#[from] blend_db::Error),
}
