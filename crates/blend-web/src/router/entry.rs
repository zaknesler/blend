use crate::error::{WebError, WebResult};
use axum::{
    extract::{Path, Query, State},
    middleware::from_fn_with_state,
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
};
use blend_db::repo::{self, entry::FilterEntriesParams};
use serde::Deserialize;
use serde_json::json;
use uuid::Uuid;

pub fn router(ctx: crate::Context) -> Router {
    Router::new()
        .route("/", get(index))
        .route("/:entry_uuid", get(view))
        .route("/:entry_uuid/read", post(update_read))
        .route("/:entry_uuid/unread", post(update_unread))
        .route_layer(from_fn_with_state(ctx.clone(), crate::middleware::auth))
        .with_state(ctx)
}

async fn index(
    State(ctx): State<crate::Context>,
    Query(params): Query<FilterEntriesParams>,
) -> WebResult<impl IntoResponse> {
    let paginated = repo::entry::EntryRepo::new(ctx.db).get_paginated_entries(params).await?;

    Ok(Json(json!(paginated)))
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

async fn update_read(
    State(ctx): State<crate::Context>,
    Path(params): Path<ViewEntryParams>,
) -> WebResult<impl IntoResponse> {
    let success = repo::entry::EntryRepo::new(ctx.db)
        .update_entry_as_read(&params.entry_uuid)
        .await?;

    Ok(Json(json!({ "success": success })))
}

async fn update_unread(
    State(ctx): State<crate::Context>,
    Path(params): Path<ViewEntryParams>,
) -> WebResult<impl IntoResponse> {
    let success = repo::entry::EntryRepo::new(ctx.db)
        .update_entry_as_unread(&params.entry_uuid)
        .await?;

    Ok(Json(json!({ "success": success })))
}
