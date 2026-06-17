import { apiClient } from '../../lib/api/api-client';

function buildQuery(params: Record<string, string | string[] | undefined>): string {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      if (value.length > 0) query.set(key, value.join(','));
      return;
    }

    if (typeof value === 'string' && value.trim()) {
      query.set(key, value);
    }
  });

  return query.toString();
}

function withQuery(path: string, query: string): string {
  return query ? `${path}?${query}` : path;
}

/**
 * SERVICE STAFF
 * GET /api/v1/public/{slug}/staff/capable?serviceId=&addOnIds=
 */
export async function fetchServiceCapableStaff(params: {
  slug: string;
  serviceId: string;
  addOnIds: string[];
}): Promise<unknown> {
  const encodedSlug = encodeURIComponent(params.slug);

  const query = buildQuery({
    serviceId: params.serviceId,
    addOnIds: params.addOnIds,
  });

  const response = await apiClient.get<unknown>(
    withQuery(`/public/${encodedSlug}/staff/capable`, query),
  );

  return response.data;
}

/**
 * PACKAGE STAFF
 * GET /api/v1/public/{slug}/package/{packageId}/staff
 *
 * This intentionally does NOT call /staff/capable with packageId.
 * Your stable web version uses this separate package endpoint.
 */
export async function fetchPackageCapableStaff(params: {
  slug: string;
  packageId: string;
}): Promise<unknown> {
  const encodedSlug = encodeURIComponent(params.slug);
  const encodedPackageId = encodeURIComponent(params.packageId);

  const response = await apiClient.get<unknown>(
    `/public/${encodedSlug}/package/${encodedPackageId}/staff`,
  );

  return response.data;
}

/**
 * SERVICE + SPECIFIC STAFF AVAILABILITY
 * GET /api/v1/public/{slug}/availability/staff/{staffId}?serviceId=&addOnIds=
 */
export async function fetchServiceStaffAvailability(params: {
  slug: string;
  staffId: string;
  serviceId: string;
  addOnIds: string[];
}): Promise<unknown> {
  const encodedSlug = encodeURIComponent(params.slug);
  const encodedStaffId = encodeURIComponent(params.staffId);

  const query = buildQuery({
    serviceId: params.serviceId,
    addOnIds: params.addOnIds,
  });

  const response = await apiClient.get<unknown>(
    withQuery(`/public/${encodedSlug}/availability/staff/${encodedStaffId}`, query),
  );

  return response.data;
}

/**
 * SERVICE + ANY STAFF AVAILABILITY
 * GET /api/v1/public/{slug}/availability/any?serviceId=&addOnIds=
 */
export async function fetchServiceAnyStaffAvailability(params: {
  slug: string;
  serviceId: string;
  addOnIds: string[];
}): Promise<unknown> {
  const encodedSlug = encodeURIComponent(params.slug);

  const query = buildQuery({
    serviceId: params.serviceId,
    addOnIds: params.addOnIds,
  });

  const response = await apiClient.get<unknown>(
    withQuery(`/public/${encodedSlug}/availability/any`, query),
  );

  return response.data;
}

/**
 * PACKAGE + SPECIFIC STAFF AVAILABILITY
 * GET /api/v1/public/{slug}/package/availability/staff/{staffId}?packageId=&addons=
 */
export async function fetchPackageStaffAvailability(params: {
  slug: string;
  staffId: string;
  packageId: string;
  addOnIds: string[];
}): Promise<unknown> {
  const encodedSlug = encodeURIComponent(params.slug);
  const encodedStaffId = encodeURIComponent(params.staffId);

  const query = buildQuery({
    packageId: params.packageId,
    addons: params.addOnIds,
  });

  const response = await apiClient.get<unknown>(
    withQuery(`/public/${encodedSlug}/package/availability/staff/${encodedStaffId}`, query),
  );

  return response.data;
}

/**
 * PACKAGE + ANY STAFF AVAILABILITY
 * GET /api/v1/public/{slug}/package/availability/staff/any?packageId=&addons=
 */
export async function fetchPackageAnyStaffAvailability(params: {
  slug: string;
  packageId: string;
  addOnIds: string[];
}): Promise<unknown> {
  const encodedSlug = encodeURIComponent(params.slug);

  const query = buildQuery({
    packageId: params.packageId,
    addons: params.addOnIds,
  });

  const response = await apiClient.get<unknown>(
    withQuery(`/public/${encodedSlug}/package/availability/staff/any`, query),
  );

  return response.data;
}

/**
 * SERVICE + SPECIFIC STAFF TIME SLOTS
 * GET /api/v1/public/{slug}/slots/staff/{staffId}?serviceId=&date=&addOnIds=
 */
export async function fetchServiceStaffTimeSlots(params: {
  slug: string;
  staffId: string;
  date: string;
  serviceId: string;
  addOnIds: string[];
}): Promise<unknown> {
  const encodedSlug = encodeURIComponent(params.slug);
  const encodedStaffId = encodeURIComponent(params.staffId);

  const query = buildQuery({
    date: params.date,
    serviceId: params.serviceId,
    addOnIds: params.addOnIds,
  });

  const response = await apiClient.get<unknown>(
    withQuery(`/public/${encodedSlug}/slots/staff/${encodedStaffId}`, query),
  );

  return response.data;
}

/**
 * SERVICE + ANY STAFF TIME SLOTS
 * GET /api/v1/public/{slug}/slots/any?serviceId=&date=&addOnIds=
 */
export async function fetchServiceAnyStaffTimeSlots(params: {
  slug: string;
  date: string;
  serviceId: string;
  addOnIds: string[];
}): Promise<unknown> {
  const encodedSlug = encodeURIComponent(params.slug);

  const query = buildQuery({
    date: params.date,
    serviceId: params.serviceId,
    addOnIds: params.addOnIds,
  });

  const response = await apiClient.get<unknown>(
    withQuery(`/public/${encodedSlug}/slots/any`, query),
  );

  return response.data;
}

/**
 * PACKAGE + SPECIFIC STAFF TIME SLOTS
 * GET /api/v1/public/{slug}/package/staff/slot/{staffId}?packageId=&date=&addons=
 */
export async function fetchPackageStaffTimeSlots(params: {
  slug: string;
  staffId: string;
  date: string;
  packageId: string;
  addOnIds: string[];
}): Promise<unknown> {
  const encodedSlug = encodeURIComponent(params.slug);
  const encodedStaffId = encodeURIComponent(params.staffId);

  const query = buildQuery({
    date: params.date,
    packageId: params.packageId,
    addons: params.addOnIds,
  });

  const response = await apiClient.get<unknown>(
    withQuery(`/public/${encodedSlug}/package/staff/slot/${encodedStaffId}`, query),
  );

  return response.data;
}

/**
 * PACKAGE + ANY STAFF TIME SLOTS
 * GET /api/v1/public/{slug}/package/staff/slot/any?packageId=&date=&addons=
 */
export async function fetchPackageAnyStaffTimeSlots(params: {
  slug: string;
  date: string;
  packageId: string;
  addOnIds: string[];
}): Promise<unknown> {
  const encodedSlug = encodeURIComponent(params.slug);

  const query = buildQuery({
    date: params.date,
    packageId: params.packageId,
    addons: params.addOnIds,
  });

  const response = await apiClient.get<unknown>(
    withQuery(`/public/${encodedSlug}/package/staff/slot/any`, query),
  );

  return response.data;
}
