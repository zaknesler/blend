use crate::error::{CryptoError, CryptoResult};
use chrono::{DateTime, Duration, Utc};
use hmac::{Hmac, Mac};
use jwt::{SignWithKey, VerifyWithKey};
use sha2::Sha256;
use std::collections::BTreeMap;

pub const JWT_EXPIRATION_DAYS: i64 = 90;
const JWT_CLAIM_USER: &str = "sub";
const JWT_CLAIM_ISSUED_AT: &str = "iat";
const JWT_CLAIM_EXPIRES_AT: &str = "exp";

/// Create a JWT for the given user ID
pub fn sign_jwt(secret: &str, user_uri: &str) -> CryptoResult<String> {
    let key: Hmac<Sha256> = Hmac::new_from_slice(secret.as_bytes())?;
    let now: DateTime<Utc> = Utc::now();

    let expiration = Duration::try_days(JWT_EXPIRATION_DAYS).expect("expiration out of bounds");

    BTreeMap::from([
        (JWT_CLAIM_USER, user_uri),
        (JWT_CLAIM_ISSUED_AT, &now.to_rfc3339()),
        (JWT_CLAIM_EXPIRES_AT, &(now + expiration).to_rfc3339()),
    ])
    .sign_with_key(&key)
    .map_err(|err| err.into())
}

/// Extract the claims from a valid JWT
pub fn extract_claims(secret: &str, jwt: &str) -> CryptoResult<BTreeMap<String, String>> {
    let key: Hmac<Sha256> = Hmac::new_from_slice(secret.as_bytes())?;
    jwt.verify_with_key(&key).map_err(|err| err.into())
}

/// Verify that a JWT is valid and extract the user ID
pub fn verify_jwt(secret: &str, jwt: &str) -> CryptoResult<String> {
    let claims = extract_claims(secret, jwt)?;

    // Check that the token hasn't expired
    if claims
        .get(JWT_CLAIM_EXPIRES_AT)
        .ok_or_else(|| CryptoError::JwtInvalid)?
        .parse::<DateTime<Utc>>()?
        < Utc::now()
    {
        return Err(CryptoError::JwtExpired);
    }

    // Attempt to extract the user ID
    Ok(claims
        .get(JWT_CLAIM_USER)
        .ok_or_else(|| CryptoError::JwtInvalid)?
        .to_owned())
}
