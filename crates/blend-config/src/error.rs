use thiserror::Error;

pub type ConfigResult<T> = Result<T, ConfigError>;

#[derive(Error, Debug)]
pub enum ConfigError {
    #[error(transparent)]
    ConfigError(#[from] config::ConfigError),
}
