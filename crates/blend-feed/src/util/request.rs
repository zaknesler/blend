use crate::error::FeedResult;
use reqwest::{ClientBuilder, Response};
use std::time::Duration;

static USER_AGENT: &str = concat!(env!("CARGO_PKG_NAME"), "/", env!("CARGO_PKG_VERSION"));

pub async fn make_request(url: &str) -> FeedResult<Response> {
    let client = ClientBuilder::new()
        .user_agent(USER_AGENT)
        .timeout(Duration::from_secs(30))
        .build()?;

    let res = client.get(url).send().await?;

    Ok(res)
}
