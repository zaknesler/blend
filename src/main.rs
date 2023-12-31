mod error;
mod model;

#[tokio::main]
async fn main() -> error::BlendResult<()> {
    let feed = reqwest::get("https://blog.rust-lang.org/feed.xml")
        .await?
        .text()
        .await?;

    let feed: model::Feed = feed_rs::parser::parse(feed.as_bytes())?.into();
    dbg!(&feed);

    Ok(())
}
