export const DEV_HOSTNAME = 'localhost:4000';

export type ApiResponse<T> = { data: T };

export type ApiErrorResponse = { error: string; status: number };
