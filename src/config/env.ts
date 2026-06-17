/**
 * Merlua React Native environment.
 *
 * Your working local setup is:
 *   adb reverse tcp:8000 tcp:8000
 *
 * That means the Android device/emulator can call your PC backend through:
 *   http://localhost:8000
 *
 * Do NOT use port 8081 for API calls.
 * Port 8081 is normally Metro Bundler, not your NestJS backend.
 */
const API_BASE_URL = 'http://localhost:8000/api/v1';

/**
 * Production API.
 * Switch manually when building production.
 */
const PROD_API_BASE_URL = 'https://api.domain.com/api/v1';
const USE_PRODUCTION_API = false;

/**
 * Stripe publishable key is safe for frontend/mobile.
 * Never put STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET in React Native.
 */
const STRIPE_PUBLISHABLE_KEY =
  'pk_test_51TRybvEkKNI7Awthu5cMlWfXoat63HKeENimgyohPAcEAoiBYACam0Vv57mzIVCaNnfIBabIfLlANzgD8lwoYk1l00EzwYrjoF';

/**
 * Customer auth refresh config.
 *
 * api-client first tries:
 * POST {API_BASE_URL}/auth/refresh
 *
 * Fill these only if you want Cognito direct fallback.
 */
const COGNITO_REGION = 'us-east-1';
const COGNITO_CUSTOMER_CLIENT_ID = '';

export const ENV = {
  API_BASE_URL: USE_PRODUCTION_API ? PROD_API_BASE_URL : API_BASE_URL,
  REQUEST_TIMEOUT_MS: 15000,

  STRIPE_PUBLISHABLE_KEY,

  COGNITO_REGION,
  COGNITO_CUSTOMER_CLIENT_ID,
} as const;

export function assertApiBaseUrlConfigured() {
  if (!ENV.API_BASE_URL.trim()) {
    throw new Error(
      'API base URL is not configured. Update src/config/env.ts before testing.',
    );
  }
}

export function assertStripePublishableKeyConfigured() {
  if (!ENV.STRIPE_PUBLISHABLE_KEY.trim()) {
    throw new Error(
      'Stripe publishable key is not configured. Update src/config/env.ts.',
    );
  }
}
