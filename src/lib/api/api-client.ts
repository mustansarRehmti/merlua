import { ENV, assertApiBaseUrlConfigured } from '../../config/env';
import { ApiRequestError, createClientError } from './api-error';
import type { ApiErrorResponse, ApiSuccessResponse } from './api.types';

interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  accessToken?: string | null;
}

function buildUrl(path: string): string {
  const base = ENV.API_BASE_URL.replace(/\/+$/, '');
  const endpoint = path.startsWith('/') ? path : `/${path}`;
  return `${base}${endpoint}`;
}

async function parseJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<ApiSuccessResponse<T>> {
  assertApiBaseUrlConfigured();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ENV.REQUEST_TIMEOUT_MS);

  try {
    const { body, accessToken, headers, ...requestOptions } = options;

    const response = await fetch(buildUrl(path), {
      ...requestOptions,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...headers,
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });

    const payload = await parseJson(response);

    if (!response.ok) {
      const apiError =
        payload && typeof payload === 'object'
          ? (payload as Partial<ApiErrorResponse>)
          : null;

      throw new ApiRequestError({
        success: false,
        statusCode: apiError?.statusCode ?? response.status,
        message:
          apiError?.message ??
          'The request could not be completed. Please try again.',
        error: apiError?.error ?? response.statusText ?? 'RequestError',
      });
    }

    if (
      !payload ||
      typeof payload !== 'object' ||
      (payload as { success?: boolean }).success !== true
    ) {
      throw new ApiRequestError(
        createClientError('The server returned an invalid response.'),
      );
    }

    return payload as ApiSuccessResponse<T>;
  } catch (error: unknown) {
    if (error instanceof ApiRequestError) throw error;

    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiRequestError(
        createClientError('The request timed out. Please try again.'),
      );
    }

    throw new ApiRequestError(
      createClientError(
        error instanceof Error
          ? error.message
          : 'A network error occurred. Please try again.',
      ),
    );
  } finally {
    clearTimeout(timeout);
  }
}

export const apiClient = {
  get<T>(path: string, options: Omit<ApiRequestOptions, 'method'> = {}) {
    return apiRequest<T>(path, { ...options, method: 'GET' });
  },

  post<T>(
    path: string,
    body?: unknown,
    options: Omit<ApiRequestOptions, 'method' | 'body'> = {},
  ) {
    return apiRequest<T>(path, { ...options, method: 'POST', body });
  },
};
