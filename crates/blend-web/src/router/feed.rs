use crate::{context::Context, error::WebResult};
use axum::{
    extract::State,
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
};
use blend_db::model;
use serde::{Deserialize, Serialize};
use serde_json::json;

pub fn router(ctx: Context) -> Router {
    Router::new()
        .route("/", get(index))
        .route("/create", get(create))
        .route("/parse", post(parse))
        // .route_layer(middleware::from_fn_with_state(
        //     ctx.clone(),
        //     crate::middleware::auth::middleware,
        // ))
        .with_state(ctx)
}

async fn index(State(ctx): State<Context>) -> WebResult<impl IntoResponse> {
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
    sqlx::query!(
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

    Ok("ok")
}

#[derive(Debug, Deserialize)]
struct ParseFeedParams {
    url: String,
}

async fn parse(Json(data): Json<ParseFeedParams>) -> WebResult<impl IntoResponse> {
    let parsed = blend_parse::parse_url(&data.url).await?;

    let title = parsed.title.map(|title| title.content);

    #[derive(Debug, Serialize)]
    struct Response {
        title: Option<String>,
    }

    let res = Response { title };
    Ok(Json(json!({"data": res})))
}
