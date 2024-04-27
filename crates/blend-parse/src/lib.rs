use error::ParseResult;
use feed_rs::model::Feed;

pub mod error;

pub async fn parse_url(url: &str) -> ParseResult<Feed> {
    let res = reqwest::get(url).await?.text().await?;
    let feed = feed_rs::parser::parse(res.as_bytes())?;

    // TODO: create Feed entity and map all necessary fields from the feed_rs model
    Ok(feed)
}
