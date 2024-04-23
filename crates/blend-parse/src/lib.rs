use error::ParseResult;
use feed_rs::model::Feed;

pub mod error;

pub async fn parse_url(url: &str) -> ParseResult<Feed> {
    let feed = reqwest::get(url).await?.text().await?;

    let feed: Feed = feed_rs::parser::parse(feed.as_bytes())?.into();
    Ok(feed)
}
