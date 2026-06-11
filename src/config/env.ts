const API_BASE_URL = 'http://localhost:8000/api/v1';

export const ENV = {
  API_BASE_URL,
  REQUEST_TIMEOUT_MS: 15000,
} as const;

export function assertApiBaseUrlConfigured() {
  if (!ENV.API_BASE_URL.trim()) {
    throw new Error(
      'API base URL is not configured. Update src/config/env.ts before testing authentication.',
    );
  }
}