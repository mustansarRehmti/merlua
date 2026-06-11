import type { ApiErrorResponse } from './api.types';

export class ApiRequestError extends Error {
  statusCode: number;
  errorCode: string;

  constructor(payload: ApiErrorResponse) {
    super(payload.message);
    this.name = 'ApiRequestError';
    this.statusCode = payload.statusCode;
    this.errorCode = payload.error;
  }
}

export function createClientError(message: string): ApiErrorResponse {
  return {
    success: false,
    statusCode: 0,
    message,
    error: 'ClientError',
  };
}

export function normalizeApiError(error: unknown): ApiErrorResponse {
  if (error instanceof ApiRequestError) {
    return {
      success: false,
      statusCode: error.statusCode,
      message: error.message,
      error: error.errorCode,
    };
  }

  if (error instanceof Error) {
    return createClientError(error.message);
  }

  return createClientError('Something went wrong. Please try again.');
}
