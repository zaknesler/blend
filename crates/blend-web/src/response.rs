use super::error::WebError;
use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use blend_crypto::Error as CryptoError;
use serde_json::{json, Value};

impl IntoResponse for WebError {
    fn into_response(self) -> Response {
        let (status, error) = match get_response(&self) {
            Some(res) => res,
            None => {
                // Log any errors for which we cannot return a useful response to the user
                tracing::error!("{}", self);

                // Send a generic 500 response
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    Value::String(self.to_string()),
                )
            }
        };

        let data = Json(json!({ "status": status.as_u16(), "error": error }));
        (status, data).into_response()
    }
}

/// Create a response for a specific error type
fn get_response(error: &WebError) -> Option<(StatusCode, Value)> {
    Some(match error {
        WebError::NotFoundError => (StatusCode::NOT_FOUND, Value::String(error.to_string())),
        WebError::UnauthorizedError
        | WebError::CryptoError(CryptoError::JwtExpired | CryptoError::JwtInvalid) => {
            (StatusCode::UNAUTHORIZED, Value::String(error.to_string()))
        }
        WebError::ValidationErrorMap(err) => (
            StatusCode::UNPROCESSABLE_ENTITY,
            json!({ "fields": err.field_errors() }),
        ),
        WebError::ValidationError(err) => (StatusCode::UNPROCESSABLE_ENTITY, json!(err)),
        _ => return None,
    })
}
