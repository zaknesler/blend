use error::FeedResult;

mod error;
pub mod model;

pub use error::FeedError as Error;

pub async fn parse_feed(url: &str) -> FeedResult<model::ParsedFeed> {
    let data = reqwest::get(url).await?.text().await?;
    let mut feed: model::ParsedFeed = feed_rs::parser::parse(data.as_bytes())
        .or_else(|err| match err {
            feed_rs::parser::ParseFeedError::ParseError(_) => todo!(), // fallback to URL and look for feed URL in <head>
            _ => Err(err),
        })?
        .into();

    // TODO: need a nicer way of doing this
    if feed.url.is_none() {
        feed.url = Some(url.to_owned());
    }

    Ok(feed)
}

pub async fn parse_entries(url: &str) -> FeedResult<Vec<model::ParsedEntry>> {
    let data = reqwest::get(url).await?.text().await?;
    let feed = feed_rs::parser::parse(data.as_bytes()).or_else(|err| match err {
        feed_rs::parser::ParseFeedError::ParseError(_) => todo!(),
        _ => Err(err),
    })?;

    let entries = feed
        .entries
        .iter()
        .cloned()
        .map(|entry| entry.into())
        .collect::<Vec<model::ParsedEntry>>();

    Ok(entries)
}
