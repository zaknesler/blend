use url::Url;

#[derive(Debug, Clone)]
pub struct ParsedUrl {
    pub url: String,
    pub trimmed: String,
    pub base: String,
}

pub fn parse_url(raw_url: &str) -> Option<ParsedUrl> {
    Url::parse(raw_url).ok().and_then(|url| {
        url.host_str().map(|domain| domain.to_string()).map(|domain| {
            // Trim trailing slashes
            let trimmed = url.to_string().trim_end_matches('/').to_string();

            // Construct the base URL from the scheme and domain
            let mut base = format!("{}://{}", url.scheme(), domain);

            // We'll need to manually add the port to the base URL
            if let Some(port) = url.port() {
                base.push_str(format!(":{}", port).as_ref());
            }

            let url = url.to_string();

            ParsedUrl { url, trimmed, base }
        })
    })
}
