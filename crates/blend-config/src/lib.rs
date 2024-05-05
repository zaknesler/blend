use crate::config::BlendConfig;
use error::{ConfigError, ConfigResult};
use figment::{
    providers::{Env, Format, Toml},
    Figment,
};
use rust_embed::RustEmbed;
use std::{
    fs::{self, File},
    io::Write,
    path::PathBuf,
    str::FromStr,
};

pub mod config;
mod error;

pub use config::BlendConfig as Config;
pub use error::ConfigError as Error;

const ENV_CONFIG_HOME_PATH: &str = "BLEND_HOME";
const ENV_PREFIX: &str = "BLEND";
const PROJECT_DIR: &str = "blend";
const DEFAULT_STUB: &str = "default.toml";
const LOCAL_CONFIG_FILE: &str = "config.toml";

#[derive(RustEmbed, Clone)]
#[folder = "$CARGO_MANIFEST_DIR/stubs"]
struct ConfigStubs;

fn get_config_dir() -> ConfigResult<PathBuf> {
    let override_path = std::env::var(ENV_CONFIG_HOME_PATH)
        .ok()
        .and_then(|dir| PathBuf::from_str(&dir).ok());

    Ok(match override_path {
        Some(path) => path,
        None => directories::ProjectDirs::from("", "", PROJECT_DIR)
            .map(|dirs| dirs.config_dir().to_path_buf())
            .ok_or_else(|| ConfigError::ConfigDirNotFound)?,
    })
}

fn get_default_data() -> Vec<u8> {
    let default = ConfigStubs::get(DEFAULT_STUB).expect("default.toml stub should exist");
    default.data.as_ref().to_owned()
}

/// Initialize config directory
pub fn init_config_dir() -> ConfigResult<PathBuf> {
    let config_dir = get_config_dir()?;

    // Create project config directory if it doesn't exist
    fs::create_dir_all(config_dir.clone())?;

    Ok(config_dir)
}

/// Initialize config directory and config.toml
pub fn init_config_file(force: bool) -> ConfigResult<PathBuf> {
    let config_dir = init_config_dir()?;

    // Create local config if it doesn't exist
    let local_config_file = config_dir.join(LOCAL_CONFIG_FILE);
    if !local_config_file.try_exists()? || force {
        let mut local_config = File::create(local_config_file)?;
        local_config.write_all(get_default_data().as_ref())?;
    }

    Ok(config_dir)
}

pub fn parse(override_path: Option<String>) -> ConfigResult<BlendConfig> {
    let config_dir = get_config_dir()?;

    let mut config =
        Figment::new()
            .merge(Toml::string(std::str::from_utf8(
                get_default_data().as_ref(),
            )?))
            .merge(Toml::file(
                config_dir
                    .join(LOCAL_CONFIG_FILE)
                    .to_str()
                    .expect("path should be valid unicode"),
            ))
            .merge(Env::prefixed(ENV_PREFIX).map(|key| {
                key.as_str().to_lowercase().trim_matches('_').replacen('_', ".", 1).into()
            }));

    if let Some(path) = override_path {
        config = config.merge(Toml::file(path))
    }

    Ok(BlendConfig {
        dir: config_dir,
        config: config.extract()?,
    })
}
