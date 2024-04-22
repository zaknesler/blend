use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct BlendConfig {
    pub dir: PathBuf,
    pub config: BaseConfig,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct BaseConfig {
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
