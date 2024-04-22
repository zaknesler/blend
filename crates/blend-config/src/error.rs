use thiserror::Error;

pub type ConfigResult<T> = Result<T, ConfigError>;

#[derive(Error, Debug)]
pub enum ConfigError {
    #[error("user config directory not found")]
    ConfigDirNotFound,

    #[error(transparent)]
    ConfigError(#[from] figment::Error),

    #[error(transparent)]
    IOError(#[from] std::io::Error),

    #[error(transparent)]
    Utf8Error(#[from] std::str::Utf8Error),
}
