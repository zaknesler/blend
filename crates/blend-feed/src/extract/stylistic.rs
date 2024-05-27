use ammonia::Builder;
use std::collections::HashSet;

const ALLOWED_TAGS: [&str; 12] = [
    "a", "abbr", "b", "code", "em", "i", "kbd", "small", "strike", "strong", "sub", "sup",
];

// Sanitize HTML input, allowing only inline/stylistic HTML elements
pub fn extract_stylistic_html(src: &str, base_url: &str) -> String {
    let mut builder = Builder::default();

    if let Ok(base_url) = base_url.parse() {
        builder.url_relative(ammonia::UrlRelative::RewriteWithBase(base_url));
    }

    builder.tags(HashSet::from(ALLOWED_TAGS)).clean(src).to_string()
}

#[cfg(test)]
mod test {
    use super::*;

    // TODO: add an extra step (or a more efficient way) to strip out empty tags left over from stripping out its child nodes.
    // #[test]
    // fn it_extracts_only_stylistic_elements() {
    //     let src = r#"<p class="feature-image"><a href="https://example.com"><img width="1600" height="840" src="https://example.com/image.jpg" class="attachment-card-large size-card-large wp-post-image" alt="Some image" decoding="async" /></a></p><p>Some body text that we <em>want</em> to keep.</p> <p class="read-more">[<a href="https://example.com">Read More</a>]</p>"#;

    //     let parsed = extract_stylistic_html(src, "https://example.com");
    //     assert_eq!(
    //         parsed,
    //         r#"Some body text that we <em>want</em> to keep. [<a href="https://example.com" rel="noopener noreferrer">Read More</a>]"#
    //     );
    // }

    #[test]
    fn it_extracts_only_stylistic_elements() {
        let src = r#"<article><p>Some body text that we <em>want</em> to keep.</p> <p class="read-more">[<a href="https://example.com">Read More</a>]</p></article>"#;

        let parsed = extract_stylistic_html(src, "https://example.com");
        assert_eq!(
            parsed,
            r#"Some body text that we <em>want</em> to keep. [<a href="https://example.com" rel="noopener noreferrer">Read More</a>]"#
        );
    }

    #[test]
    fn it_allows_strong_and_b_tags() {
        let src = r#"<p>Text with <strong>strong</strong> and <b>bold</b> tags.</p>"#;

        let parsed = extract_stylistic_html(src, "https://example.com");
        assert_eq!(
            parsed,
            r#"Text with <strong>strong</strong> and <b>bold</b> tags."#
        );
    }

    #[test]
    fn it_flattens_span_and_div() {
        let src = r#"<p>Text with <div>div</div> and <div><span>span</span></div> tags.</p>"#;

        let parsed = extract_stylistic_html(src, "https://example.com");
        assert_eq!(parsed, r#"Text with div and span tags."#);
    }

    #[test]
    fn it_allows_a_tags() {
        let src = r#"<p>Text with <a href="https://example.com">link</a> inside.</p>"#;

        let parsed = extract_stylistic_html(src, "https://example.com");
        assert_eq!(
            parsed,
            r#"Text with <a href="https://example.com" rel="noopener noreferrer">link</a> inside."#
        );
    }

    #[test]
    fn replaces_relative_urls_with_absolute_urls() {
        let src = r#"<p>Text with <a href="/inside">link</a> inside.</p>"#;

        let parsed = extract_stylistic_html(src, "https://example.com");
        assert_eq!(
            parsed,
            r#"Text with <a href="https://example.com/inside" rel="noopener noreferrer">link</a> inside."#
        );
    }
}
