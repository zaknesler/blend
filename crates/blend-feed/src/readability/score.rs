use super::dom;
use html5ever::namespace_url;
use html5ever::tree_builder::TreeSink;
use html5ever::tree_builder::{ElementFlags, NodeOrText};
use html5ever::{ns, LocalName, QualName};
use markup5ever_rcdom::Handle;
use markup5ever_rcdom::Node;
use markup5ever_rcdom::NodeData::{Element, Text};
use markup5ever_rcdom::RcDom;
use regex::Regex;
use std::cell::Cell;
use std::collections::BTreeMap;
use std::path::Path;
use std::rc::Rc;

pub static PUNCTUATIONS_REGEX: &str = r"([、。，．！？]|\.[^A-Za-z0-9]|,[^0-9]|!|\?)";
pub static UNLIKELY_CANDIDATES: &str = "combx|comment|community|disqus|extra|foot|header|menu|remark|rss|shoutbox|sidebar|sponsor|ad-break|agegate|pagination|pager|popup|tweet|twitter|ssba";
pub static LIKELY_CANDIDATES: &str = "and|article|body|column|main|shadow|content";
pub static POSITIVE_CANDIDATES: &str =
    "article|body|content|entry|main|page|pagination|post|text|blog|story";
pub static NEGATIVE_CANDIDATES: &str = "combx|comment|com|contact|foot|footer|footnote|masthead|media|meta|outbrain|promo|related|scroll|shoutbox|sidebar|sponsor|shopping|tags|tool|widget|form|textfield|uiScale|hidden";
static BLOCK_CHILD_TAGS: [&str; 10] = [
    "a",
    "blockquote",
    "dl",
    "div",
    "img",
    "ol",
    "p",
    "pre",
    "table",
    "ul",
];

lazy_static! {
    static ref PUNCTUATIONS: Regex = Regex::new(PUNCTUATIONS_REGEX).unwrap();
    static ref LIKELY: Regex = Regex::new(LIKELY_CANDIDATES).unwrap();
    static ref UNLIKELY: Regex = Regex::new(UNLIKELY_CANDIDATES).unwrap();
    static ref POSITIVE: Regex = Regex::new(POSITIVE_CANDIDATES).unwrap();
    static ref NEGATIVE: Regex = Regex::new(NEGATIVE_CANDIDATES).unwrap();
}

pub struct Candidate {
    pub node: Rc<Node>,
    pub score: Cell<f32>,
}

pub fn get_link_density(handle: Handle) -> f32 {
    let text_length = dom::text_len(handle.clone()) as f32;
    if text_length == 0.0 {
        return 0.0;
    }

    let mut link_length = 0.0;
    let mut links: Vec<Rc<Node>> = vec![];

    dom::find_node(handle.clone(), "a", &mut links);

    for link in links.iter() {
        link_length += dom::text_len(link.clone()) as f32;
    }

    link_length / text_length
}

pub fn is_candidate(handle: Handle) -> bool {
    let text_len = dom::text_len(handle.clone());
    if text_len < 20 {
        return false;
    }

    let n = dom::get_tag_name(handle.clone()).unwrap_or_default();

    match n.as_str() {
        "p" => true,
        "div" | "article" | "center" | "section" => {
            !dom::has_nodes(handle.clone(), &BLOCK_CHILD_TAGS.to_vec())
        }
        _ => false,
    }
}

pub fn init_content_score(handle: Handle) -> f32 {
    let tag_name = dom::get_tag_name(handle.clone()).unwrap_or_default();
    let score = match tag_name.as_ref() {
        "article" => 10.0,
        "div" => 5.0,
        "blockquote" => 3.0,
        "form" => -3.0,
        "th" => 5.0,
        _ => 0.0,
    };

    score + get_class_weight(handle.clone())
}

pub fn calc_content_score(handle: Handle) -> f32 {
    let mut score: f32 = 1.0;
    let mut text = String::new();

    dom::extract_text(handle.clone(), &mut text, true);

    let mat = PUNCTUATIONS.find_iter(&text);

    score += mat.count() as f32;
    score += f32::min(f32::floor(text.chars().count() as f32 / 100.0), 3.0);
    score
}

pub fn get_class_weight(handle: Handle) -> f32 {
    let mut weight: f32 = 0.0;
    if let Element {
        name: _, ref attrs, ..
    } = handle.data
    {
        for name in ["id", "class"].iter() {
            if let Some(val) = dom::attr(name, &attrs.borrow()) {
                if POSITIVE.is_match(&val) {
                    weight += 25.0
                };

                if NEGATIVE.is_match(&val) {
                    weight -= 25.0
                }
            }
        }
    };

    weight
}

pub fn preprocess(dom: &mut RcDom, handle: Handle, title: &mut String) -> bool {
    if let Element {
        ref name,
        ref attrs,
        ..
    } = handle.clone().data
    {
        let tag_name = name.local.as_ref();

        match tag_name.to_lowercase().as_ref() {
            "script" | "link" | "style" => return true,
            "title" => dom::extract_text(handle.clone(), title, true),
            _ => (),
        }

        for name in ["id", "class"].iter() {
            if let Some(val) = dom::attr(name, &attrs.borrow()) {
                if tag_name != "body" && UNLIKELY.is_match(&val) && !LIKELY.is_match(&val) {
                    return true;
                }
            }
        }
    }

    let mut useless_nodes = vec![];
    let mut paragraph_nodes = vec![];
    let mut br_count = 0;

    for child in handle.children.borrow().iter() {
        if preprocess(dom, child.clone(), title) {
            useless_nodes.push(child.clone());
        }

        let c = child.clone();

        match c.data {
            Element { ref name, .. } => {
                let tag_name = name.local.as_ref();
                if "br" == tag_name.to_lowercase() {
                    br_count += 1
                } else {
                    br_count = 0
                }
            }
            Text { ref contents } => {
                let s = contents.borrow();
                if br_count >= 2 && !s.trim().is_empty() {
                    paragraph_nodes.push(child.clone());
                    br_count = 0
                }
            }
            _ => (),
        }
    }

    for node in useless_nodes.iter() {
        dom.remove_from_parent(node);
    }

    for node in paragraph_nodes.iter() {
        let name = QualName::new(None, ns!(), LocalName::from("p"));
        let p = dom.create_element(name, vec![], ElementFlags::default());

        dom.append_before_sibling(node, NodeOrText::AppendNode(p.clone()));
        dom.remove_from_parent(node);

        if let Text { ref contents } = node.clone().data {
            let text = contents.clone().into_inner().clone();
            dom.append(&p, NodeOrText::AppendText(text))
        }
    }

    false
}

pub fn find_candidates(
    id: &Path,
    handle: Handle,
    candidates: &mut BTreeMap<String, Candidate>,
    nodes: &mut BTreeMap<String, Rc<Node>>,
) {
    if let Some(id) = id.to_str().map(|id| id.to_string()) {
        nodes.insert(id, handle.clone());
    }

    if is_candidate(handle.clone()) {
        let score = calc_content_score(handle.clone());

        if let Some(c) =
            id.parent().and_then(|pid| find_or_create_candidate(pid, candidates, nodes))
        {
            c.score.set(c.score.get() + score)
        }

        if let Some(c) = id
            .parent()
            .and_then(|pid| pid.parent())
            .and_then(|gpid| find_or_create_candidate(gpid, candidates, nodes))
        {
            c.score.set(c.score.get() + score / 2.0)
        }
    }

    if is_candidate(handle.clone()) {
        let score = calc_content_score(handle.clone());

        if let Some(c) = id.to_str().map(|id| id.to_string()).and_then(|id| candidates.get(&id)) {
            c.score.set(c.score.get() + score)
        }

        if let Some(c) = id
            .parent()
            .and_then(|pid| pid.to_str())
            .map(|id| id.to_string())
            .and_then(|pid| candidates.get(&pid))
        {
            c.score.set(c.score.get() + score)
        }

        if let Some(c) = id
            .parent()
            .and_then(|p| p.parent())
            .and_then(|pid| pid.to_str())
            .map(|id| id.to_string())
            .and_then(|pid| candidates.get(&pid))
        {
            c.score.set(c.score.get() + score)
        }
    }

    for (i, child) in handle.children.borrow().iter().enumerate() {
        find_candidates(
            id.join(i.to_string()).as_path(),
            child.clone(),
            candidates,
            nodes,
        )
    }
}

fn find_or_create_candidate<'a>(
    id: &Path,
    candidates: &'a mut BTreeMap<String, Candidate>,
    nodes: &BTreeMap<String, Rc<Node>>,
) -> Option<&'a Candidate> {
    if let Some(id) = id.to_str().map(|id| id.to_string()) {
        if let Some(node) = nodes.get(&id) {
            if candidates.get(&id).is_none() {
                candidates.insert(
                    id.clone(),
                    Candidate {
                        node: node.clone(),
                        score: Cell::new(init_content_score(node.clone())),
                    },
                );
            }
            return candidates.get(&id);
        }
    }

    None
}
