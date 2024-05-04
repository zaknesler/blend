use crate::error::{WebError, WebResult};
use axum::{
    extract::{Path, State},
    middleware,
    response::IntoResponse,
    routing::get,
    Json, Router,
};
use blend_db::repo;
use serde::Deserialize;
use serde_json::json;
use uuid::Uuid;

pub fn router(ctx: crate::Context) -> Router {
    Router::new()
        .route("/", get(index))
        .route("/:entry_uuid", get(view))
        .route_layer(middleware::from_fn_with_state(
            ctx.clone(),
            crate::middleware::auth::middleware,
        ))
        .with_state(ctx)
}

#[derive(Deserialize)]
struct IndexEntriesParams {
    feed_uuid: Uuid,
}

async fn index(
    State(ctx): State<crate::Context>,
    Path(params): Path<IndexEntriesParams>,
) -> WebResult<impl IntoResponse> {
    let entries = repo::entry::EntryRepo::new(ctx.db)
        .get_entries_for_feed(&params.feed_uuid)
        .await
        .unwrap_or_else(|_| vec![]);

    Ok(Json(json!({ "data": entries })))
}

#[derive(Deserialize)]
struct ViewEntryParams {
    feed_uuid: Uuid,
    entry_uuid: Uuid,
}

async fn view(
    State(ctx): State<crate::Context>,
    Path(params): Path<ViewEntryParams>,
) -> WebResult<impl IntoResponse> {
    let entry = repo::entry::EntryRepo::new(ctx.db)
        .get_entry(&params.feed_uuid, &params.entry_uuid)
        .await?
        .ok_or_else(|| WebError::NotFoundError)?;

    Ok(Json(json!({ "data": entry })))
}
