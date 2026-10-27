import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  details?: unknown;
  meta?: Record<string, unknown>;
}

/**
 * Returns a standardized JSON success response.
 */
export function apiSuccess<T>(data: T, meta?: Record<string, unknown>, status: number = 200) {
  const body: ApiResponse<T> = {
    success: true,
    data,
    ...(meta ? { meta } : {})
  };
  return NextResponse.json(body, { status });
}

/**
 * Returns a standardized JSON error response.
 * Never leaks stack traces or database connection details.
 */
export function apiError(
  message: string,
  status: number = 400,
  details: unknown = null,
  headers?: Record<string, string>
) {
  const body: ApiResponse = {
    success: false,
    error: message,
    ...(details ? { details } : {})
  };
  return NextResponse.json(body, { status, headers });
}

/**
 * Transforms Zod validation errors into field-level error mappings.
 */
export function formatZodError(error: ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.join('.') || 'root';
    if (!fieldErrors[path]) {
      fieldErrors[path] = issue.message;
    }
  }
  return fieldErrors;
}

/**
 * Safe error handler for catch blocks.
 */
export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return apiError('Validation failed. Please verify your submitted data.', 422, formatZodError(error));
  }

  const err = error as Error;
  console.error('[API Error]:', err.message);

  // Check for common error types
  if (err.message.includes('Unauthorized') || err.message.includes('Authentication')) {
    return apiError(err.message, 401);
  }

  if (err.message.includes('Forbidden') || err.message.includes('Access denied')) {
    return apiError(err.message, 403);
  }

  if (err.message.includes('Not Found') || err.message.includes('not found')) {
    return apiError(err.message, 404);
  }

  // Generic 500 error without exposing stack traces
  return apiError('An unexpected server error occurred. Please try again or contact support.', 500);
}
