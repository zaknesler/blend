use error::FeedResult;

pub mod error;
pub mod model;

pub async fn parse_url(url: &str) -> FeedResult<model::ParsedFeed> {
    let res = reqwest::get(url).await?.text().await?;
    let feed = feed_rs::parser::parse(res.as_bytes())?;
    Ok(feed.into())
}
