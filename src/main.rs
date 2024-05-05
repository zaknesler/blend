use clap::Parser;
use futures::{future::FutureExt, pin_mut, select};
use std::sync::Arc;
use tokio::sync::{broadcast, mpsc, Mutex};

mod args;
mod error;

const CHANNEL_BUFFER_SIZE: usize = 1024;

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

            let (job_tx, job_rx) = mpsc::channel::<blend_worker::Job>(CHANNEL_BUFFER_SIZE);
            let jobs = Arc::new(Mutex::new(job_tx));

            let (notif_tx, _) =
                broadcast::channel::<blend_worker::Notification>(CHANNEL_BUFFER_SIZE);
            let notifs = Arc::new(Mutex::new(notif_tx));

            // Start worker and web tasks concurrently
            let mut worker = blend_worker::Worker::new(db.clone(), job_rx, notifs.clone());
            let worker = worker.start().fuse();

            let web = blend_web::serve(blend_web::Context {
                blend,
                db,
                jobs,
                notifs,
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
