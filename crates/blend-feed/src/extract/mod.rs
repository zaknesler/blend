mod html;
mod stylistic;
mod text;

pub use html::*;
pub use stylistic::*;
pub use text::*;

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
}
