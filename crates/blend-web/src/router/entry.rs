use crate::error::{WebError, WebResult};
use axum::{
    extract::{Path, Query, State},
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
struct IndexEntriesQuery {
    feed: Option<Uuid>,
}

async fn index(
    State(ctx): State<crate::Context>,
    Query(params): Query<IndexEntriesQuery>,
) -> WebResult<impl IntoResponse> {
    let repo = repo::entry::EntryRepo::new(ctx.db);

    let entries = match params.feed {
        Some(uuid) => repo.get_entries_for_feed(&uuid).await,
        None => repo.get_entries().await,
    }
    .unwrap_or_else(|_| vec![]);

    Ok(Json(json!({ "data": entries })))
}

#[derive(Deserialize)]
struct ViewEntryParams {
    entry_uuid: Uuid,
}

async fn view(
    State(ctx): State<crate::Context>,
    Path(params): Path<ViewEntryParams>,
) -> WebResult<impl IntoResponse> {
    let entry = repo::entry::EntryRepo::new(ctx.db)
        .get_entry(&params.entry_uuid)
        .await?
        .ok_or_else(|| WebError::NotFoundError)?;

    Ok(Json(json!({ "data": entry })))
}
