mod error;

#[tokio::main]
async fn main() -> error::BlendResult<()> {
    blend_cli::run().await?;
    Ok(())
}
