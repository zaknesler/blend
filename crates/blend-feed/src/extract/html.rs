use ammonia::Builder;
use std::collections::HashSet;

const REMOVE_TAGS: [&str; 1] = ["article"];

// Sanitize HTML input, allowing only safe elements
pub fn extract_html(src: &str, base_url: &str) -> String {
    let mut builder = Builder::default();

    if let Ok(base_url) = base_url.parse() {
        builder.url_relative(ammonia::UrlRelative::RewriteWithBase(base_url));
    }

    builder
        .rm_tags(HashSet::from(REMOVE_TAGS))
        .set_tag_attribute_value("img", "loading", "lazy")
        .set_tag_attribute_value("img", "decoding", "async")
        .clean(src)
        .to_string()
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn it_keeps_only_safe_elements() {
        let src = r#"<article><p>Some body text that we <em>want</em> to keep.</p><p class="read-more">[<a href="https://example.com">Read More</a>]</p><script>alert("gotcha")</script><style>body { display: none }</style></article>"#;

        let parsed = extract_html(src, "https://example.com");
        assert_eq!(
            parsed,
            r#"<p>Some body text that we <em>want</em> to keep.</p><p>[<a href="https://example.com" rel="noopener noreferrer">Read More</a>]</p>"#
        );
    }

    #[test]
    fn replaces_relative_urls_with_absolute_urls() {
        let src = r#"<article><p>Some body text that we <em>want</em> to keep.</p><p class="read-more">[<a href="/read-more">Read More</a>]</p><script>alert("gotcha")</script><style>body { display: none }</style></article>"#;

        let parsed = extract_html(src, "https://example.com");
        assert_eq!(
            parsed,
            r#"<p>Some body text that we <em>want</em> to keep.</p><p>[<a href="https://example.com/read-more" rel="noopener noreferrer">Read More</a>]</p>"#
        );
    }
}
