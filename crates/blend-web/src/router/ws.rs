use crate::error::WebResult;
use axum::{
    extract::{ws::WebSocket, State, WebSocketUpgrade},
    response::IntoResponse,
    routing::get,
    Router,
};
use futures_util::{sink::SinkExt, stream::StreamExt};

pub fn router(ctx: crate::Context) -> Router {
    Router::new().route("/jobs", get(jobs)).with_state(ctx)
}

async fn jobs(
    ws: WebSocketUpgrade,
    State(ctx): State<crate::Context>,
) -> WebResult<impl IntoResponse> {
    Ok(ws.on_upgrade(|socket| handle_socket(socket, ctx)))
}

async fn handle_socket(socket: WebSocket, ctx: crate::Context) {
    // Create a new broadcast receiver
    let mut rx = ctx.worker.lock().await.subscribe();

    let (mut ws_sender, _) = socket.split();

    // Stream broadcast messages to the WebSocket sender
    while let Ok(job) = rx.recv().await {
        let json = serde_json::to_string(&job).unwrap();

        // Send the broadcast message to the WebSocket client
        if ws_sender.send(axum::extract::ws::Message::Text(json)).await.is_err() {
            // If sending the message fails, break the loop
            break;
        }
    }
}
