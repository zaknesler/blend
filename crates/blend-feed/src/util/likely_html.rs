use crate::{extract_html, extract_stylistic_html};

/// Test if given input is likely HTML, based on the difference between the parsed style/inline tags vs. the sanitized HTML.
pub fn likely_html(src: &str) -> bool {
    let stylistic = extract_stylistic_html(src, "");
    let html = extract_html(src, "");

    stylistic != html
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn returns_true_for_html() {
        assert_eq!(likely_html(r#"<p>Some HTML</p>"#), true);
        assert_eq!(likely_html(r#"<div>Some HTML</div>"#), true);
        assert_eq!(likely_html(r#"<div>Some <em>HTML</em></div>"#), true);
    }

    #[test]
    fn returns_false_for_non_html() {
        assert_eq!(likely_html(r#"Some HTML"#), false);
        assert_eq!(likely_html(r#"Some <em>HTML</em>"#), false);
        assert_eq!(
            likely_html(r#"<strike><strong>Some</strong> <em>HTML</em></strike>"#),
            false
        );
    }

    #[test]
    fn it_works_on_real_example() {
        let src = r#"
            <p class="feature-image">
                <a href="https://example.com">
                    <img width="1600" height="840" src="https://example.com/image.jpg" class="attachment-card-large size-card-large wp-post-image" alt="Some image." decoding="async" />
                </a>
            </p>
            <p>Some long description.</p>
            <p class="read-more">
                [<a href="https://example.com">Read More</a>]
            </p>
        "#;

        assert_eq!(likely_html(src), true);
    }
}
