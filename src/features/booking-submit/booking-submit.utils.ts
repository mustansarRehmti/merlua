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

    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number') return String(value);
  }

  return null;
}

function extractArray(value: unknown, preferredKeys: string[]): unknown[] {
  if (Array.isArray(value)) return value;

  const record = asRecord(value);
  if (!record) return [];

  for (const key of [...preferredKeys, 'items', 'results', 'data']) {
    if (key in record) {
      const nested = extractArray(record[key], preferredKeys);
      if (nested.length > 0 || Array.isArray(record[key])) return nested;
    }
  }

  return [];
}

function firstNestedRecord(payload: unknown): Record<string, unknown> | null {
  const record = asRecord(payload);
  return asRecord(record?.data) ?? record;
}

export function extractBookingGroupId(payload: unknown): string | null {
  const record = firstNestedRecord(payload);

  const direct =
    readString(record, ['bookingGroupId', 'booking_group_id', 'groupId']) ??
    readString(asRecord(record?.bookingGroup), ['id', 'bookingGroupId']);

  if (direct) return direct;

  const appointments = extractArray(record?.appointments ?? record?.appointment, [
    'appointments',
  ]);

  for (const appointment of appointments) {
    const appointmentRecord = asRecord(appointment);

    const bookingGroupId =
      readString(appointmentRecord, ['bookingGroupId', 'groupId']) ??
      readString(asRecord(appointmentRecord?.bookingGroup), ['id', 'bookingGroupId']);

    if (bookingGroupId) return bookingGroupId;
  }

  return readString(record, ['id']);
}

export function extractAppointmentIds(payload: unknown): string[] {
  const record = firstNestedRecord(payload);
  const appointments = extractArray(record?.appointments ?? record?.appointment, [
    'appointments',
  ]);

  const ids = appointments
    .map(item => readString(asRecord(item), ['id', 'appointmentId']))
    .filter((value): value is string => Boolean(value));

  const directId = readString(record, ['appointmentId']);
  if (directId) ids.push(directId);

  return [...new Set(ids)];
}

export function extractClientSecret(payload: unknown): string | null {
  const record = firstNestedRecord(payload);

  return (
    readString(record, ['clientSecret', 'paymentIntentClientSecret']) ??
    readString(asRecord(record?.paymentIntent), ['clientSecret']) ??
    readString(asRecord(record?.stripe), ['clientSecret'])
  );
}

export function extractSessionId(payload: unknown): string | null {
  const record = firstNestedRecord(payload);

  return (
    readString(record, ['sessionId', 'checkoutSessionId']) ??
    readString(asRecord(record?.session), ['id', 'sessionId']) ??
    readString(asRecord(record?.checkout), ['sessionId']) ??
    readString(asRecord(record?.stripe), ['sessionId'])
  );
}

export function extractCheckoutUrl(payload: unknown): string | null {
  const record = firstNestedRecord(payload);

  const direct =
    readString(record, [
      'url',
      'checkoutUrl',
      'checkoutURL',
      'checkout_url',
      'paymentUrl',
      'paymentURL',
      'payment_url',
      'redirectUrl',
      'redirect_url',
      'sessionUrl',
      'stripeCheckoutUrl',
    ]) ??
    readString(asRecord(record?.session), ['url', 'checkoutUrl']) ??
    readString(asRecord(record?.checkout), ['url', 'checkoutUrl']) ??
    readString(asRecord(record?.stripe), ['url', 'checkoutUrl', 'paymentUrl']);

  if (!direct) return null;

  return /^https?:\/\//i.test(direct) ? direct : null;
}
