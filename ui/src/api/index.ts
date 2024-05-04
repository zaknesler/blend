export type ApiResponse<T> = { data: T };
export type ApiSuccessResponse = { success: boolean };
export type ApiErrorResponse = { error: string; status: number };
