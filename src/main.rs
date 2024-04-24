use clap::Parser;

mod args;
mod error;

#[tokio::main]
async fn main() -> error::BlendResult<()> {
    let args = crate::args::Args::parse();

    // Initialize tracing
    tracing_subscriber::fmt()
        .with_max_level(args.log_level)
        .init();

    match args.command {
        crate::args::Command::PublishConfig { force } => {
            let path = blend_config::init_config_file(force)?;
            if let Some(path) = path.to_str() {
                tracing::info!(
                    "{} config to {}",
                    if force {
                        "Force published"
                    } else {
                        "Published"
                    },
                    path,
                )
            }
        }

        crate::args::Command::Web => {
            let blend = blend_config::parse(args.config)?;
            let db = blend_db::client::init(blend.clone()).await?;
            let context = blend_context::Context { blend, db };

            blend_web::serve(context).await?;
        }
    }

    Ok(())
}
