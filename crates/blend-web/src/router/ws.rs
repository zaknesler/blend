use crate::error::WebResult;
use axum::{
    extract::{ws::WebSocket, State, WebSocketUpgrade},
    response::IntoResponse,
    routing::get,
    Router,
};
use futures_util::{sink::SinkExt, stream::StreamExt};

pub fn router(ctx: crate::Context) -> Router {
    Router::new().route("/notifs", get(notifs)).with_state(ctx)
}

async fn notifs(
    ws: WebSocketUpgrade,
    State(ctx): State<crate::Context>,
) -> WebResult<impl IntoResponse> {
    Ok(ws.on_upgrade(|socket| handle_socket(socket, ctx)))
}

async fn handle_socket(socket: WebSocket, ctx: crate::Context) {
    // Create a new broadcast receiver
    let mut rx = ctx.notifs.lock().await.subscribe();

    // Split the websocket to get the sender part
    let (mut ws_sender, _) = socket.split();

    // Stream broadcast messages to the WebSocket sender
    while let Ok(notif) = rx.recv().await {
        let json = serde_json::to_string(&notif).unwrap();

        // Send the notification
        if ws_sender.send(axum::extract::ws::Message::Text(json)).await.is_err() {
            break;
        }
    }
}
