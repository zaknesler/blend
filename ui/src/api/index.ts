export type ApiResponse<T> = { data: T };
export type ApiPaginatedResponse<T> = { data: T; next_cursor?: string };
export type ApiSuccessResponse = { success: boolean };
export type ApiErrorResponse = { error: string; status: number };
