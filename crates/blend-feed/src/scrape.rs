use crate::{error::FeedResult, Error};
use article_scraper::ArticleScraper;
use reqwest::Client;
use url::Url;

pub async fn scrape_entry(url: String) -> FeedResult<Option<String>> {
    let scraper = ArticleScraper::new(None).await;
    let url = Url::parse(&url)?;
    let client = Client::new();
    let article = scraper
        .parse(&url, false, &client, None)
        .await
        .map_err(|err| Error::ScrapeError(err.to_string()))?;

    Ok(article.html)
}
