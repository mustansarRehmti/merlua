import { ENV, assertApiBaseUrlConfigured } from '../../config/env';
import {
  clearCustomerSession,
  readCustomerSession,
  saveCustomerSession,
} from '../storage/secure-storage';
import type { StoredCustomerSession } from '../../features/auth/auth.types';
import { ApiRequestError, createClientError } from './api-error';
import type { ApiErrorResponse, ApiSuccessResponse } from './api.types';

interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  accessToken?: string | null;
}

let refreshPromise: Promise<StoredCustomerSession | null> | null = null;

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

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function readString(
  record: Record<string, unknown> | null,
  keys: string[],
): string | null {
  if (!record) return null;

  for (const key of keys) {
    const value = record[key];

    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  return null;
}

/**
 * Pure TypeScript base64url decoder.
 * Do not use Buffer in React Native.
 * Do not use globalThis['atob']; strict TS rejects it without DOM/browser types.
 */
function decodeBase64UrlToString(value: string): string {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

  let bits = '';
  let output = '';

  for (const char of base64.replace(/=+$/, '')) {
    const index = alphabet.indexOf(char);
    if (index === -1) continue;

    bits += index.toString(2).padStart(6, '0');

    while (bits.length >= 8) {
      const byte = bits.slice(0, 8);
      bits = bits.slice(8);
      output += String.fromCharCode(parseInt(byte, 2));
    }
  }

  try {
    return decodeURIComponent(
      output
        .split('')
        .map(char => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join(''),
    );
  } catch {
    return output;
  }
}

function decodeJwtPayload(token: string): Record<string, unknown> {
  try {
    const payload = token.split('.')[1];
    if (!payload) return {};

    return JSON.parse(decodeBase64UrlToString(payload));
  } catch {
    return {};
  }
}

function isTokenExpiringSoon(token: string): boolean {
  const exp = decodeJwtPayload(token).exp;

  if (typeof exp !== 'number' || exp <= 0) {
    return false;
  }

  return exp - Math.floor(Date.now() / 1000) < 60;
}

function getJwtClientId(token: string): string {
  const payload = decodeJwtPayload(token);

  return (
    (typeof payload.client_id === 'string' && payload.client_id) ||
    (typeof payload.aud === 'string' && payload.aud) ||
    ''
  );
}

function isWrongCustomerClient(token: string): boolean {
  if (!ENV.COGNITO_CUSTOMER_CLIENT_ID.trim()) return false;

  const tokenClientId = getJwtClientId(token);

  return Boolean(
    tokenClientId &&
      tokenClientId !== ENV.COGNITO_CUSTOMER_CLIENT_ID.trim(),
  );
}

async function refreshWithBackend(refreshToken: string): Promise<string | null> {
  try {
    const response = await fetch(buildUrl('/auth/refresh'), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    const payload = await parseJson(response);
    if (!response.ok) return null;

    const record = asRecord(payload);
    const data = asRecord(record?.data);

    return (
      readString(data, ['accessToken']) ??
      readString(record, ['accessToken']) ??
      null
    );
  } catch {
    return null;
  }
}

async function refreshWithCognito(refreshToken: string): Promise<string | null> {
  if (!ENV.COGNITO_CUSTOMER_CLIENT_ID.trim()) {
    return null;
  }

  try {
    const response = await fetch(
      `https://cognito-idp.${ENV.COGNITO_REGION}.amazonaws.com/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-amz-json-1.1',
          'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
        },
        body: JSON.stringify({
          AuthFlow: 'REFRESH_TOKEN_AUTH',
          ClientId: ENV.COGNITO_CUSTOMER_CLIENT_ID,
          AuthParameters: {
            REFRESH_TOKEN: refreshToken,
          },
        }),
      },
    );

    const payload = await parseJson(response);
    if (!response.ok) return null;

    const authenticationResult = asRecord(
      asRecord(payload)?.AuthenticationResult,
    );

    return readString(authenticationResult, ['AccessToken']);
  } catch {
    return null;
  }
}

async function refreshStoredCustomerSession(): Promise<StoredCustomerSession | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const currentSession = await readCustomerSession();

    if (!currentSession?.refreshToken) {
      await clearCustomerSession();
      return null;
    }

    const refreshedAccessToken =
      (await refreshWithBackend(currentSession.refreshToken)) ??
      (await refreshWithCognito(currentSession.refreshToken));

    if (!refreshedAccessToken) {
      await clearCustomerSession();
      return null;
    }

    if (isWrongCustomerClient(refreshedAccessToken)) {
      await clearCustomerSession();
      return null;
    }

    const nextSession: StoredCustomerSession = {
      ...currentSession,
      accessToken: refreshedAccessToken,
    };

    await saveCustomerSession(nextSession);

    return nextSession;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

async function resolveAccessTokenForRequest(
  explicitAccessToken?: string | null,
): Promise<string | null> {
  if (!explicitAccessToken) return null;

  const storedSession = await readCustomerSession();

  /**
   * Prefer Keychain over Redux-provided token.
   * Redux can still hold an expired access token after api-client refreshes it.
   */
  const tokenFromStorage = storedSession?.accessToken;
  let accessToken = tokenFromStorage || explicitAccessToken;

  if (!accessToken) return null;

  if (isWrongCustomerClient(accessToken)) {
    await clearCustomerSession();

    throw new ApiRequestError(
      createClientError('Customer session is invalid. Please log in again.'),
    );
  }

  if (isTokenExpiringSoon(accessToken)) {
    const refreshedSession = await refreshStoredCustomerSession();

    if (refreshedSession?.accessToken) {
      accessToken = refreshedSession.accessToken;
    }
  }

  return accessToken;
}

function isUnauthorizedResponse(response: Response, payload: unknown): boolean {
  if (response.status === 401) return true;

  const record = asRecord(payload);
  const message = readString(record, ['message'])?.toLowerCase() ?? '';
  const error = readString(record, ['error'])?.toLowerCase() ?? '';

  return (
    response.status === 403 &&
    (message.includes('token expired') ||
      message.includes('jwt expired') ||
      error.includes('token expired') ||
      error.includes('jwt expired'))
  );
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

    const authRequested = Boolean(accessToken);
    const resolvedAccessToken = await resolveAccessTokenForRequest(accessToken);

    let response = await fetch(buildUrl(path), {
      ...requestOptions,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(resolvedAccessToken
          ? { Authorization: `Bearer ${resolvedAccessToken}` }
          : {}),
        ...headers,
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });

    let payload = await parseJson(response);

    if (authRequested && isUnauthorizedResponse(response, payload)) {
      const refreshedSession = await refreshStoredCustomerSession();

      if (refreshedSession?.accessToken) {
        response = await fetch(buildUrl(path), {
          ...requestOptions,
          signal: controller.signal,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${refreshedSession.accessToken}`,
            ...headers,
          },
          ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
        });

        payload = await parseJson(response);
      }
    }

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
