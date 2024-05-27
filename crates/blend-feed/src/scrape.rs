use crate::{error::FeedResult, util::make_request};

pub async fn scrape_entry(url: String) -> FeedResult<Option<String>> {
    let res = make_request(&url).await?;

    if !res.status().is_success() {
        return Ok(None);
    }

    let data = res.text().await?;
    let article = crate::readability::extract(&data)?;

    Ok(article.map(|article| article.content))
}
