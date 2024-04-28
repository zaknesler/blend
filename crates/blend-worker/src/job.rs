use blend_feed::model::ParsedFeed;

#[derive(Debug)]
pub enum Job {
    FetchMetadata(ParsedFeed),
    FetchEntries(ParsedFeed),
}
