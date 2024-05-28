use crate::error::FeedResult;
use html5ever::{parse_document, tendril::TendrilSink};
use markup5ever_rcdom::{RcDom, SerializableHandle};
use std::{cell::Cell, collections::BTreeMap, io::Cursor, path::Path};

mod dom;
mod score;

#[derive(Debug)]
pub struct Result {
    pub title: String,
    pub content: String,
}

pub fn extract(input: &str) -> FeedResult<Option<Result>> {
    let mut data = Cursor::new(input.as_bytes());

    let mut dom = parse_document(RcDom::default(), Default::default())
        .from_utf8()
        .read_from(&mut data)?;

    let mut title = String::new();
    let mut candidates = BTreeMap::new();
    let mut nodes = BTreeMap::new();
    let handle = dom.document.clone();

    score::preprocess(&mut dom, handle.clone(), &mut title);
    score::find_candidates(Path::new("/"), handle.clone(), &mut candidates, &mut nodes);

    let mut top_candidate = &score::Candidate {
        node: handle.clone(),
        score: Cell::new(0.0),
    };

    for (_, c) in candidates.iter() {
        let score = c.score.get() * (1.0 - score::get_link_density(c.node.clone()));
        c.score.set(score);
        if score <= top_candidate.score.get() {
            continue;
        }
        top_candidate = c;
    }

    let mut bytes = vec![];
    let node = top_candidate.node.clone();

    html5ever::serialize(
        &mut bytes,
        &SerializableHandle::from(node.clone()),
        Default::default(),
    )
    .ok();

    let result = String::from_utf8(bytes).ok().map(|content| Result { title, content });

    Ok(result)
}
