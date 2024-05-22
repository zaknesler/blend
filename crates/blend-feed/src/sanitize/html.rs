use ammonia::Builder;
use std::collections::HashSet;

const REMOVE_TAGS: [&str; 1] = ["article"];

// Sanitize HTML input, allowing only safe elements
pub fn sanitize_html(src: &str) -> String {
    Builder::default().rm_tags(HashSet::from(REMOVE_TAGS)).clean(src).to_string()
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn it_keeps_only_safe_elements() {
        let src = r#"<article><p>Some body text that we <em>want</em> to keep.</p><p class="read-more">[<a href="https://example.com">Read More</a>]</p><script>alert("gotcha")</script><style>body { display: none }</style></article>"#;

        let parsed = sanitize_html(src);
        assert_eq!(
            parsed,
            r#"<p>Some body text that we <em>want</em> to keep.</p><p>[<a href="https://example.com" rel="noopener noreferrer">Read More</a>]</p>"#
        );
    }
}
