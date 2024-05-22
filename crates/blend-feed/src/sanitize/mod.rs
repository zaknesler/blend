mod stylistic;
pub use stylistic::sanitize_stylistic_html;

mod text;
pub use text::sanitize_text;

mod html;
pub use html::sanitize_html;

// TODO: use `.url_relative(UrlRelative::RewriteWithBase(...))` with ammonia and pass in site URL to rewrite relative URLs
