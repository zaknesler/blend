use crate::error::WebResult;
use axum::{
    extract::{ws::WebSocket, State, WebSocketUpgrade},
    middleware::from_fn_with_state,
    response::IntoResponse,
    routing::get,
    Router,
};
use futures_util::{sink::SinkExt, stream::StreamExt};

pub fn router(ctx: crate::Context) -> Router {
    Router::new()
        .route("/notifications", get(notifications))
        .route_layer(from_fn_with_state(ctx.clone(), crate::middleware::auth))
        .with_state(ctx)
}

async fn notifications(
    ws: WebSocketUpgrade,
    State(ctx): State<crate::Context>,
) -> WebResult<impl IntoResponse> {
    Ok(ws.on_upgrade(|socket| handle_socket(socket, ctx)))
}

async fn handle_socket(socket: WebSocket, ctx: crate::Context) {
    let mut rx = ctx.notifs.lock().await.subscribe();
    let (mut ws_sender, _) = socket.split();

    while let Ok(notif) = rx.recv().await {
        let json = serde_json::to_string(&notif).unwrap();

        if ws_sender.send(axum::extract::ws::Message::Text(json)).await.is_err() {
            break;
        }
    }
}
