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

        args::Command::Parse { url } => {
            let feed = blend_feed::parse_feed(&url).await?;
            dbg!(&feed);
        }

        crate::args::Command::Start => {
            let blend = blend_config::parse(args.config)?;
            let db = blend_db::client::init(blend.clone()).await?;

            // Create job queue channel
            let (job_tx, mut job_rx) = mpsc::channel::<blend_worker::Job>(CHANNEL_BUFFER_SIZE);
            let job_tx = Arc::new(Mutex::new(job_tx));

            // Create notification channel
            let (notif_tx, mut notif_rx) =
                broadcast::channel::<blend_worker::Notification>(CHANNEL_BUFFER_SIZE);
            let notif_tx = Arc::new(Mutex::new(notif_tx));

            // Start queue and refresh workers
            let queue_worker = blend_worker::start_queue_worker(
                db.clone(),
                &mut job_rx,
                job_tx.clone(),
                notif_tx.clone(),
            )
            .fuse();
            let refresh_worker =
                blend_worker::start_refresh_worker(job_tx.clone(), db.clone()).fuse();

            // Start web server
            let web = blend_web::serve(blend_web::Context {
                blend,
                db,
                job_tx,
                notif_tx,
            })
            .fuse();

            // Simple async closure to print notifications
            let notif_printer = async move {
                while let Ok(notif) = notif_rx.recv().await {
                    tracing::info!("{}", notif);
                }
            }
            .fuse();

            pin_mut!(queue_worker, refresh_worker, web, notif_printer);
            select! {
                result = queue_worker => result?,
                result = refresh_worker => result?,
                result = web => result?,
                result = notif_printer => result,
            };
        }
    }

    Ok(())
}
