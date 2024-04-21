use blend_entity::feed::Feed;
use error::ParseResult;

pub mod error;

pub async fn parse_url(url: &str) -> ParseResult<Feed> {
    let feed = reqwest::get(url).await?.text().await?;

    let feed: Feed = feed_rs::parser::parse(feed.as_bytes())?.into();
    Ok(feed)
}
