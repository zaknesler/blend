use ammonia::Builder;

/// Extract safe and sanitized HTML elements.
pub fn sanitize_html(src: &str) -> String {
    Builder::default().clean(src).to_string()
}
