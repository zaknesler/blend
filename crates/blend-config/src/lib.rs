use error::ConfigResult;

use crate::config::BlendConfig;
use std::path;

pub mod config;
pub mod error;

const CONFIG_PREFIX: &str = "BLEND";
const CONFIG_DIR: &str = ".config";

const FILES_PRECEDENCE: [&str; 2] = ["default.toml", "local.toml"];

pub fn parse_config(override_path: Option<String>) -> ConfigResult<BlendConfig> {
    let dir = path::Path::new(CONFIG_DIR);

    let mut config = FILES_PRECEDENCE
        .iter()
        .fold(::config::Config::builder(), |config, file| {
            config.add_source(::config::File::with_name(dir.join(file).to_str().unwrap()))
        });

    if let Some(path) = override_path {
        config = config.add_source(::config::File::with_name(path.as_ref()));
    }

    let config: BlendConfig = config
        .add_source(::config::Environment::with_prefix(CONFIG_PREFIX))
        .build()?
        .try_deserialize()?;

    Ok(config)
}
