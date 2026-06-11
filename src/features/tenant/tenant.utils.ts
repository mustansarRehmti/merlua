const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function normalizeTenantSlug(value: string): string {
  return value.trim().toLowerCase();
}

export function isValidTenantSlug(value: string): boolean {
  return SLUG_PATTERN.test(normalizeTenantSlug(value));
}
