// API URL to use during development, when the API and UI are running separately
export const DEV_API_URL = 'http://localhost:4000';

export type ApiResponse<T> = { data: T };

export type ApiErrorResponse = { error: string; status: number };
