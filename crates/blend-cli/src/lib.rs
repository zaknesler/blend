use blend_web::context::Context;
use clap::Parser;
use error::CliResult;

mod args;
pub mod error;

pub async fn run() -> CliResult<()> {
    let args = crate::args::Args::parse();
    let config = blend_config::parse_config(args.config)?;

    // Initialize tracing
    tracing_subscriber::fmt()
        .with_max_level(args.log_level)
        .init();

    let context = Context { config };

    match args.command {
        args::Command::Web => blend_web::serve(context).await?,
    }

    Ok(())
}
