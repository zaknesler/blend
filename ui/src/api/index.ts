export type ApiResponse<T> = { data: T };
export type ApiPaginatedResponse<T> = { data: T; next_cursor?: string };
export type ApiSuccessResponse = { success: boolean };
export type ApiErrorResponse = { error: string; status: number };
export type ApiFieldErrorResponse = {
  error: { fields: Record<string, { code: string; message: string; params: Record<string, unknown> }[]> };
  status: number;
};

export const getFieldError = (error: Error | null | undefined, field: string) => {
  if (!error?.message) return null;

  // Attempt to parse error message
  const parsed = JSON.parse(error.message) as ApiErrorResponse | ApiFieldErrorResponse | undefined;
  if (!parsed) return null;

  // If the error is not a field error, don't return anything
  if (typeof parsed.error === 'string') return null;

  return parsed.error.fields[field];
};

export const getErrorMessage = (error: Error | null) => {
  if (!error?.message) return null;

  // Attempt to parse error message
  const parsed = JSON.parse(error.message) as ApiErrorResponse | ApiFieldErrorResponse | undefined;
  if (!parsed) return null;

  // If the error is a field error, don't return anything
  if (typeof parsed.error !== 'string') return null;

  return parsed.error;
};
