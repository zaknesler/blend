use error::FeedResult;

pub mod error;
pub mod model;

pub async fn parse_feed(url: &str) -> FeedResult<model::ParsedFeed> {
    let data = reqwest::get(url).await?.text().await?;
    let feed = feed_rs::parser::parse(data.as_bytes()).or_else(|err| match err {
        feed_rs::parser::ParseFeedError::ParseError(_) => todo!(),
        _ => Err(err),
    })?;

    Ok(feed.into())
}
