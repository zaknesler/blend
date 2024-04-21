use clap::Parser;

mod args;
mod error;

#[tokio::main]
async fn main() -> error::BlendResult<()> {
    let args = crate::args::Args::parse();
    let config = blend_config::parse_config(args.config)?;

    // Initialize tracing
    tracing_subscriber::fmt()
        .with_max_level(args.log_level)
        .init();

    let context = blend_web::context::Context { config };

    match args.command {
        crate::args::Command::Web => blend_web::serve(context).await?,
    }

    Ok(())
}
