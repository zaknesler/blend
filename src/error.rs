pub type BlendResult<T> = Result<T, BlendError>;

#[derive(Debug, thiserror::Error)]
pub enum BlendError {
    #[error(transparent)]
    CliError(#[from] blend_cli::error::CliError),
}
