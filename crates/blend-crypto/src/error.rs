pub type CryptoResult<T> = Result<T, CryptoError>;

#[derive(thiserror::Error, Debug)]
pub enum CryptoError {
    #[error("jwt expired")]
    JwtExpired,

    #[error("invalid jwt")]
    JwtInvalid,

    #[error(transparent)]
    HmacError(#[from] hmac::digest::InvalidLength),

    #[error(transparent)]
    JwtError(#[from] jwt::Error),

    #[error(transparent)]
    PasswordHashError(#[from] argon2::password_hash::Error),

    #[error(transparent)]
    ChronoParseError(#[from] chrono::ParseError),
}
