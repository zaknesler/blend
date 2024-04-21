pub type CliResult<T> = Result<T, CliError>;

#[derive(thiserror::Error, Debug)]
pub enum CliError {
    #[error(transparent)]
    ConfigError(#[from] blend_config::error::ConfigError),

    #[error(transparent)]
    WebError(#[from] blend_web::error::WebError),
}
