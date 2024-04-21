use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct BlendConfig {
    pub debug: bool,
    pub web: WebConfig,
    pub database: DatabaseConfig,
    pub crypto: CryptoConfig,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct WebConfig {
    pub host: String,
    pub port: u16,
    pub allowed_origins: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DatabaseConfig {
    pub file: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CryptoConfig {
    pub jwt_signing_key: String,
}
