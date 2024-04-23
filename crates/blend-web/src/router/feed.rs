use crate::{context::Context, error::WebResult};
use axum::{extract::State, response::IntoResponse, routing::get, Json, Router};
use blend_db::model;
use serde_json::json;

pub fn router(ctx: Context) -> Router {
    Router::new()
        .route("/", get(index))
        .route("/create", get(create))
        // .route_layer(middleware::from_fn_with_state(
        //     ctx.clone(),
        //     crate::middleware::auth::middleware,
        // ))
        .with_state(ctx)
}

async fn index(State(ctx): State<Context>) -> WebResult<impl IntoResponse> {
    // let parsed = parse_url("https://blog.rust-lang.org/feed.xml").await?;

    let feeds: Vec<model::Feed> = sqlx::query_as!(model::Feed, "SELECT * FROM feeds")
        .fetch_all(&ctx.db)
        .await?;

    Ok(Json(json!({ "data": feeds })))
}

async fn create(State(ctx): State<Context>) -> WebResult<impl IntoResponse> {
    let mut conn = ctx.db.acquire().await?;

    let title = "Rust Blog";
    let url = "https://blog.rust-lang.org/feed.xml";

    // Insert the task, then obtain the ID of this row
    let id = sqlx::query!(
        r#"
        INSERT INTO feeds ( title, url )
        VALUES ( ?1, ?2 )
        "#,
        title,
        url
    )
    .execute(&mut *conn)
    .await?
    .last_insert_rowid();

    dbg!(&id);

    Ok("ok")
}
