use clap::Parser;

#[derive(Parser, Debug)]
#[clap(version, author, about, long_about = None)]
pub struct Args {
    /// Set log level
    #[clap(long, short, default_value = "info")]
    pub log_level: LogLevel,

    /// Path to config file, overrides default
    #[clap(long, short)]
    pub config: Option<String>,

    #[clap(subcommand)]
    pub command: Command,
}

#[derive(Debug, Parser)]
pub enum Command {
    /// Publish default config to $BLEND_HOME or the OS-default config directory
    Publish {
        /// Overwrite existing config file if it already exists
        #[clap(long, short)]
        force: bool,
    },

    /// Parse a URL and debug print the result
    Parse {
        #[arg(value_name = "URL")]
        url: String,
    },

    /// Start web and worker processes
    Start,
}

#[derive(clap::ValueEnum, Debug, Clone)]
pub enum LogLevel {
    Trace,
    Debug,
    Info,
    Warn,
    Error,
}

impl From<LogLevel> for tracing::metadata::LevelFilter {
    fn from(log_level: LogLevel) -> Self {
        match log_level {
            LogLevel::Trace => tracing::metadata::LevelFilter::TRACE,
            LogLevel::Debug => tracing::metadata::LevelFilter::DEBUG,
            LogLevel::Info => tracing::metadata::LevelFilter::INFO,
            LogLevel::Warn => tracing::metadata::LevelFilter::WARN,
            LogLevel::Error => tracing::metadata::LevelFilter::ERROR,
        }
    }
}
