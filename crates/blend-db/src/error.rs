use thiserror::Error;

pub type DbResult<T> = Result<T, DbError>;

#[derive(Error, Debug)]
pub enum DbError {
    #[error("invalid id")]
    InvalidId,
}
