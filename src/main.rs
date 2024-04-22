use clap::Parser;

mod args;
mod error;

#[tokio::main]
async fn main() -> error::BlendResult<()> {
    let args = crate::args::Args::parse();
    let blend = blend_config::parse(args.config)?;

    // Initialize tracing
    tracing_subscriber::fmt()
        .with_max_level(args.log_level)
        .init();

    let context = blend_web::context::Context { blend };

    match args.command {
        crate::args::Command::Web => blend_web::serve(context).await?,
    }

    Ok(())
}
