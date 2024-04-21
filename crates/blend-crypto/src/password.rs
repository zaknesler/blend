use crate::error::CryptoResult;
use argon2::{
    password_hash::{rand_core, SaltString},
    Argon2, PasswordHash, PasswordHasher, PasswordVerifier,
};

/// Hash the given password using argon2
pub fn hash_password(password: &str) -> CryptoResult<String> {
    let salt = SaltString::generate(&mut rand_core::OsRng);

    Argon2::default()
        .hash_password(password.as_bytes(), &salt)
        .map_err(|err| err.into())
        .map(|pass| pass.to_string())
}

/// Verify an argon2 hashed password against a raw password
pub fn verify_password(password_hash: &str, password_to_check: &str) -> CryptoResult<()> {
    let parsed_hash = PasswordHash::new(password_hash)?;

    Argon2::default()
        .verify_password(password_to_check.as_bytes(), &parsed_hash)
        .map_err(|err| err.into())
}
