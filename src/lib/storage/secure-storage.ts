import * as Keychain from 'react-native-keychain';
import type { StoredCustomerSession } from '../../features/auth/auth.types';

const AUTH_SERVICE = 'com.merlua.customer.auth';
const AUTH_USERNAME = 'merlua-customer-session';

export async function saveCustomerSession(
  session: StoredCustomerSession,
): Promise<void> {
  await Keychain.setGenericPassword(AUTH_USERNAME, JSON.stringify(session), {
    service: AUTH_SERVICE,
  });
}

export async function readCustomerSession(): Promise<StoredCustomerSession | null> {
  const credentials = await Keychain.getGenericPassword({
    service: AUTH_SERVICE,
  });

  if (!credentials) return null;

  try {
    const parsed = JSON.parse(credentials.password) as StoredCustomerSession;

    if (!parsed.accessToken || !parsed.refreshToken || !parsed.email || !parsed.slug) {
      await clearCustomerSession();
      return null;
    }

    return parsed;
  } catch {
    await clearCustomerSession();
    return null;
  }
}

export async function clearCustomerSession(): Promise<void> {
  await Keychain.resetGenericPassword({ service: AUTH_SERVICE });
}
