import type {
  BookingAvailabilityCalendar,
  BookingAvailabilityDay,
  BookingSlot,
  BookingStaffOption,
} from './booking-draft.types';

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function readString(
  record: Record<string, unknown>,
  keys: string[],
): string | null {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number') return String(value);
  }

  return null;
}

function readNumber(
  record: Record<string, unknown>,
  keys: string[],
): number | null {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === 'number' && Number.isFinite(value)) return value;

    if (typeof value === 'string' && value.trim()) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
  }

  return null;
}

function readBoolean(
  record: Record<string, unknown>,
  keys: string[],
): boolean | null {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === 'boolean') return value;

    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      if (normalized === 'true') return true;
      if (normalized === 'false') return false;
    }
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

export function normalizeStaffOptions(payload: unknown): BookingStaffOption[] {
  const seen = new Set<string>();

  return extractArray(payload, ['staff', 'staffMembers', 'providers'])
    .map((value): BookingStaffOption | null => {
      const record = asRecord(value);
      if (!record) return null;

      const active = readBoolean(record, ['active', 'isActive']);
      if (active === false) return null;

      const id = readString(record, ['id', 'staffId', '_id']);
      const name = readString(record, ['name', 'fullName', 'staffName']);

      if (!id || !name) return null;
      if (seen.has(id)) return null;

      seen.add(id);

      return {
        id,
        name,
        imageUrl: readString(record, ['imageUrl', 'avatarUrl', 'photoUrl']),
      };
    })
    .filter((value): value is BookingStaffOption => value !== null);
}

export function normalizeAvailabilityCalendar(
  payload: unknown,
): BookingAvailabilityCalendar {
  const root = asRecord(payload);

  const availabilityRecord =
    asRecord(root?.availability) ??
    asRecord(root?.calendar) ??
    root ??
    null;

  const daysPayload =
    availabilityRecord?.days ??
    root?.days ??
    root?.unavailableDays ??
    [];

  const days = extractArray(daysPayload, ['days'])
    .map((value): BookingAvailabilityDay | null => {
      const record = asRecord(value);
      if (!record) return null;

      const date = readString(record, ['date', 'day']);
      if (!date) return null;

      const dayOfWeek = readNumber(record, ['dayOfWeek']);

      const normalizedDay: BookingAvailabilityDay = {
        date,
        status: readString(record, ['status']) ?? 'UNAVAILABLE',
        reason: readString(record, ['reason', 'message']),
      };

      if (dayOfWeek !== null) {
        normalizedDay.dayOfWeek = dayOfWeek;
      }

      return normalizedDay;
    })
    .filter((value): value is BookingAvailabilityDay => value !== null);

  return {
    rangeStart:
      readString(availabilityRecord ?? {}, ['rangeStart', 'startDate']) ??
      readString(root ?? {}, ['rangeStart', 'startDate']),
    rangeEnd:
      readString(availabilityRecord ?? {}, ['rangeEnd', 'endDate']) ??
      readString(root ?? {}, ['rangeEnd', 'endDate']),
    capableStaff: readNumber(root ?? {}, ['capableStaff']) ?? undefined,
    days,
  };
}

export function normalizeSlots(
  payload: unknown,
  selectedDate: string,
): BookingSlot[] {
  return extractArray(payload, ['slots', 'availableSlots', 'timeSlots', 'times'])
    .map((value, index): BookingSlot | null => {
      if (typeof value === 'string') {
        const normalizedTime = parseTimeLabelToTwentyFourHour(value);
        const label = formatTimeLabel(value);

        return {
          id: `${selectedDate}-${value}`,
          time: normalizedTime,
          available: true,
          label,
          startDateTime: buildLocalStartDateTime(selectedDate, value),
          raw: value,
        };
      }

      const record = asRecord(value);
      if (!record) return null;

      const available = readBoolean(record, ['available', 'isAvailable']);
      if (available === false) return null;

      const rawTime = readString(record, [
        'time',
        'slot',
        'displayTime',
        'label',
      ]);

      const normalizedTime = rawTime
        ? parseTimeLabelToTwentyFourHour(rawTime)
        : null;

      const explicitStartDateTime = readString(record, [
        'startDateTime',
        'startDatetime',
        'start',
        'datetime',
        'dateTime',
        'value',
      ]);

      /**
       * IMPORTANT:
       * Do not fabricate UTC time with ".000Z".
       *
       * Your backend validates availability in the business local timezone.
       * Sending "2026-06-17T09:00:00.000Z" can shift the time and make the
       * backend think the staff is unavailable.
       *
       * For { time: "09:00", available: true }, send local datetime:
       * "2026-06-17T09:00:00"
       */
      const startDateTime =
        explicitStartDateTime ??
        (rawTime ? buildLocalStartDateTime(selectedDate, rawTime) : null);

      const label =
        (rawTime ? formatTimeLabel(rawTime) : null) ??
        readString(record, ['label', 'displayTime']) ??
        formatSlotLabel(startDateTime);

      if (!startDateTime || !label) return null;

      const staffId = readString(record, [
        'staffId',
        'assignedStaffId',
        'providerId',
        'employeeId',
      ]);

      const normalizedSlot: BookingSlot = {
        id:
          readString(record, ['id', 'slotId']) ??
          `${selectedDate}-${startDateTime}-${index}`,
        time:
          normalizedTime ??
          extractTimeFromStartDateTime(startDateTime) ??
          label,
        available: available ?? true,
        label,
        startDateTime,
        raw: value,
      };

      if (staffId !== null) {
        normalizedSlot.staffId = staffId;
      }

      return normalizedSlot;
    })
    .filter((value): value is BookingSlot => value !== null);
}

function buildLocalStartDateTime(
  selectedDate: string,
  timeLabel: string,
): string {
  const parsed = parseTimeLabelToTwentyFourHour(timeLabel);
  return `${selectedDate}T${parsed}:00`;
}

function parseTimeLabelToTwentyFourHour(timeLabel: string): string {
  const trimmed = timeLabel.trim();

  const twentyFourHourMatch = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (twentyFourHourMatch) {
    return `${String(Number(twentyFourHourMatch[1])).padStart(2, '0')}:${twentyFourHourMatch[2]}`;
  }

  const twelveHourMatch = trimmed.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);

  if (!twelveHourMatch) return '00:00';

  let hour = Number(twelveHourMatch[1]);
  const minute = twelveHourMatch[2];
  const meridiem = twelveHourMatch[3].toUpperCase();

  if (meridiem === 'PM' && hour < 12) hour += 12;
  if (meridiem === 'AM' && hour === 12) hour = 0;

  return `${String(hour).padStart(2, '0')}:${minute}`;
}

function formatTimeLabel(timeValue: string): string {
  const date = new Date(`2000-01-01T${parseTimeLabelToTwentyFourHour(timeValue)}:00`);
  if (Number.isNaN(date.getTime())) return timeValue;

  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatSlotLabel(startDateTime: string | null): string | null {
  if (!startDateTime) return null;

  const date = new Date(startDateTime);
  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function extractTimeFromStartDateTime(startDateTime: string): string | null {
  const match = startDateTime.match(/T(\d{1,2}):(\d{2})/);
  if (!match) return null;

  return `${String(Number(match[1])).padStart(2, '0')}:${match[2]}`;
}

export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function generateDateStrip(
  rangeStart?: string | null,
  rangeEnd?: string | null,
  maxDays = 60,
) {
  const start = rangeStart ? new Date(`${rangeStart}T00:00:00`) : new Date();
  const end = rangeEnd ? new Date(`${rangeEnd}T00:00:00`) : null;

  const dates: Array<{
    dayName: string;
    dayNumber: string;
    fullDate: string;
  }> = [];

  for (let index = 0; index < maxDays; index += 1) {
    const current = new Date(start);
    current.setDate(start.getDate() + index);

    if (end && current > end) break;

    dates.push({
      dayName: current.toLocaleDateString([], { weekday: 'short' }),
      dayNumber: String(current.getDate()).padStart(2, '0'),
      fullDate: formatDateKey(current),
    });
  }

  return dates;
}

export function formatLongDate(dateKey: string): string {
  const date = new Date(`${dateKey}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateKey;

  return date.toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}
