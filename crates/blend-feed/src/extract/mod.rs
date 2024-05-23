mod stylistic;
pub use stylistic::extract_stylistic_html;

mod text;
pub use text::extract_text;

mod html;
pub use html::extract_html;

// TODO: use `.url_relative(UrlRelative::RewriteWithBase(...))` with ammonia and pass in site URL to rewrite relative URLs
