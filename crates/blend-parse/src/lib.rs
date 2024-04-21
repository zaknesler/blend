use blend_entity::feed::Feed;
use error::ParseResult;

pub mod error;

async fn main() -> ParseResult<()> {
    let feed = reqwest::get("https://blog.rust-lang.org/feed.xml")
        .await?
        .text()
        .await?;

    let feed: Feed = feed_rs::parser::parse(feed.as_bytes())?.into();
    dbg!(&feed);

    Ok(())
}
