use clap::Parser;
use futures::{future::FutureExt, pin_mut, select};
use std::sync::Arc;
use tokio::sync::mpsc;

mod args;
mod error;

#[tokio::main]
async fn main() -> error::BlendResult<()> {
    let args = crate::args::Args::parse();

    // Initialize tracing
    tracing_subscriber::fmt().with_max_level(args.log_level).init();

    match args.command {
        crate::args::Command::Publish { force } => {
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

        crate::args::Command::Start => {
            let blend = blend_config::parse(args.config)?;
            let db = blend_db::client::init(blend.clone()).await?;

            let (tx, rx) = mpsc::channel::<blend_worker::Job>(1);

            // Start worker and web tasks concurrently
            let mut worker = blend_worker::Worker::new(blend.clone(), db.clone(), rx);
            let worker = worker.start().fuse();

            let web = blend_web::serve(blend_web::Context {
                blend,
                db,
                worker: Arc::new(tx),
            })
            .fuse();

            pin_mut!(worker, web);
            select! {
                result = web => result?,
                result = worker => result?,
            };
        }
    }

    Ok(())
}
