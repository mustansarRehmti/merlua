import { ENV } from '../../config/env';
import type {
  CatalogAddOn,
  CatalogItem,
  CatalogItemType,
} from './catalog.types';

export function getCatalogItemKey(
  itemType: CatalogItemType,
  itemId: string,
): string {
  return `${itemType}:${itemId}`;
}

export function getCatalogAddOnsKey(
  slug: string,
  itemType: CatalogItemType,
  itemId: string,
): string {
  return `${slug}:${itemType}:${itemId}`;
}

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

function toCents(record: Record<string, unknown>): number {
  // Explicit cent fields
  const explicitCents = readNumber(record, [
    'priceCents',
    'amountCents',
    'costCents',
  ]);

  if (explicitCents !== null) return Math.max(0, Math.round(explicitCents));

  // Decimal price fields (including package-specific ones)
  const decimalAmount = readNumber(record, [
    'price',
    'amount',
    'cost',
    'basePrice',
    'packagePrice',
    'finalPrice',   // <-- ADDED for packages
  ]);

  return decimalAmount === null ? 0 : Math.max(0, Math.round(decimalAmount * 100));
}

function toDurationMinutes(record: Record<string, unknown>): number {
  const duration = readNumber(record, [
    'durationMinutes',
    'durationInMinutes',
    'duration',
    'timeMinutes',
    'serviceDuration',
    'packageDuration',
    'totalDuration',   // <-- ADDED for packages
  ]);

  return duration === null ? 0 : Math.max(0, Math.round(duration));
}

function getBackendOrigin(): string {
  return ENV.API_BASE_URL.replace(/\/api\/v1\/?$/, '');
}

function resolveImageUrl(record: Record<string, unknown>): string | null {
  let directValue = readString(record, [
    'imageUrl',
    'imageURL',
    'image',
    'imagePath',
    'thumbnailUrl',
    'thumbnail',
    'coverImageUrl',
    'serviceImage',
    'packageImage',
    'mediaUrl',
  ]);

  if (!directValue) {
    const imageRecord = asRecord(record.image);
    directValue = imageRecord
      ? readString(imageRecord, ['url', 'path', 'imageUrl'])
      : null;
  }

  if (!directValue) return null;
  if (/^https?:\/\//i.test(directValue)) return directValue;

  const origin = getBackendOrigin();
  return `${origin}${directValue.startsWith('/') ? '' : '/'}${directValue}`;
}

function resolveCategoryName(record: Record<string, unknown>): string | null {
  const direct = readString(record, ['categoryName', 'categoryTitle']);
  if (direct) return direct;

  const category = record.category ?? record.serviceCategory;
  if (typeof category === 'string' && category.trim()) return category.trim();

  const categoryRecord = asRecord(category);
  if (!categoryRecord) return null;

  return readString(categoryRecord, ['name', 'title', 'categoryName']);
}

function normalizeItem(
  value: unknown,
  type: CatalogItemType,
): CatalogItem | null {
  const record = asRecord(value);
  if (!record) return null;

  const id = readString(record, [
    'id',
    type === 'service' ? 'serviceId' : 'packageId',
    '_id',
  ]);

  const name = readString(record, [
    'name',
    'title',
    type === 'service' ? 'serviceName' : 'packageName',
  ]);

  if (!id || !name) return null;

  return {
    id,
    type,
    name,
    description:
      readString(record, ['description', 'details', 'summary']) ?? '',
    durationMinutes: toDurationMinutes(record),
    priceCents: toCents(record),
    imageUrl: resolveImageUrl(record),
    categoryName: resolveCategoryName(record),
  };
}

function normalizeAddOn(value: unknown): CatalogAddOn | null {
  const record = asRecord(value);
  if (!record) return null;

  const id = readString(record, ['id', 'addonId', 'addOnId', '_id']);
  const name = readString(record, ['name', 'title', 'addonName', 'addOnName']);

  if (!id || !name) return null;

  return {
    id,
    name,
    description:
      readString(record, ['description', 'details', 'summary']) ?? '',
    durationMinutes: toDurationMinutes(record),
    priceCents: toCents(record),
    imageUrl: resolveImageUrl(record),
  };
}

export function normalizeServices(payload: unknown): CatalogItem[] {
  return extractArray(payload, ['services'])
    .map(value => normalizeItem(value, 'service'))
    .filter((value): value is CatalogItem => Boolean(value));
}

export function normalizePackages(payload: unknown): CatalogItem[] {
  return extractArray(payload, ['packages'])
    .flatMap(value => {
      const base = normalizeItem(value, 'package');
      if (!base) return [];

      const record = asRecord(value);
      const servicesArray = record
        ? extractArray(record.services ?? record.serviceList ?? [], ['services'])
        : [];

      const services: CatalogItem[] = servicesArray
        .map(serviceValue => normalizeItem(serviceValue, 'service'))
        .filter((v): v is CatalogItem => Boolean(v));

      return [{ ...base, services }];
    });
}

export function normalizeAddOns(payload: unknown): CatalogAddOn[] {
  return extractArray(payload, ['addons', 'addOns'])
    .map(normalizeAddOn)
    .filter((value): value is CatalogAddOn => Boolean(value));
}

export function formatMoney(priceCents: number): string {
  return `$${(priceCents / 100).toFixed(2)}`;
}

export function formatDuration(durationMinutes: number): string {
  if (durationMinutes <= 0) return 'No extra time';

  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;

  if (hours === 0) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
  if (minutes === 0) return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;

  return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${minutes} minutes`;
}