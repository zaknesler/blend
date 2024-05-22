use ammonia::Builder;

/// Sanitize HTML input, allowing only text.
pub fn sanitize_text(src: &str) -> String {
    Builder::empty().clean(src).to_string()
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn it_extracts_only_stylistic_elements() {
        let src = r#"<p class="feature-image"><a href="https://example.com"><img width="1600" height="840" src="https://example.com/image.jpg" class="attachment-card-large size-card-large wp-post-image" alt="Some image" decoding="async" /></a></p><p>Some body text that we <em>want</em> to keep.</p> <p class="read-more">[<a href="https://example.com">Read More</a>]</p>"#;

        let parsed = sanitize_text(src);
        assert_eq!(
            parsed,
            r#"Some body text that we want to keep. [Read More]"#
        );
    }

    #[test]
    fn it_allows_strong_and_b_tags() {
        let src = r#"<p>Text with <strong>strong</strong> and <b>bold</b> tags.</p>"#;

        let parsed = sanitize_text(src);
        assert_eq!(parsed, r#"Text with strong and bold tags."#);
    }

    #[test]
    fn it_flattens_span_and_div() {
        let src = r#"<p>Text with <div>div</div> and <div><span>span</span></div> tags.</p>"#;

        let parsed = sanitize_text(src);
        assert_eq!(parsed, r#"Text with div and span tags."#);
    }

    #[test]
    fn it_removes_a_tags() {
        let src = r#"<p>Text with <a href="/">link</a> inside.</p>"#;

        let parsed = sanitize_text(src);
        assert_eq!(parsed, r#"Text with link inside."#);
    }
}
