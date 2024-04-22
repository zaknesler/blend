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
};

pub mod config;
pub mod error;

const ENV_PREFIX: &str = "BLEND";
const PROJECT_DIR: &str = "blend";
const DEFAULT_STUB: &str = "default.toml";
const LOCAL_CONFIG_FILE: &str = "config.toml";

#[derive(RustEmbed, Clone)]
#[folder = "$CARGO_MANIFEST_DIR/stubs"]
struct ConfigStubs;

pub fn parse(override_path: Option<String>) -> ConfigResult<BlendConfig> {
    let config_dir = directories::ProjectDirs::from("", "", PROJECT_DIR)
        .map(|dirs| dirs.config_dir().to_path_buf())
        .ok_or_else(|| ConfigError::ConfigDirNotFound)?;

    let default = ConfigStubs::get(DEFAULT_STUB).expect("missing default.toml config stub");
    let default_data = default.data.as_ref();

    // Create project config directory if it doesn't exist
    fs::create_dir_all(config_dir.clone())?;

    // Create local config if it doesn't exist
    let local_config_file = config_dir.join(LOCAL_CONFIG_FILE);
    if !local_config_file.try_exists()? {
        let mut local_config = File::create(local_config_file)?;
        local_config.write_all(default_data)?;
    }

    let mut config = Figment::new()
        .merge(Toml::string(std::str::from_utf8(default_data)?))
        .merge(Toml::file(
            config_dir
                .join(LOCAL_CONFIG_FILE)
                .to_str()
                .expect("path sould be valid unicode"),
        ))
        .merge(Env::prefixed(ENV_PREFIX).map(|key| {
            key.as_str()
                .to_lowercase()
                .trim_matches('_')
                .replacen('_', ".", 1)
                .into()
        }));

    if let Some(path) = override_path {
        config = config.merge(Toml::file(path))
    }

    Ok(BlendConfig {
        dir: config_dir,
        config: config.extract()?,
    })
}
