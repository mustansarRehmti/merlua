import { apiClient } from '../../lib/api/api-client';
import type { CatalogItemType } from './catalog.types';

export async function fetchPublicServices(slug: string): Promise<unknown> {
  const response = await apiClient.get<unknown>(
    `/public/${encodeURIComponent(slug)}/services`,
  );

  return response.data;
}

export async function fetchPublicPackages(slug: string): Promise<unknown> {
  const response = await apiClient.get<unknown>(
    `/public/${encodeURIComponent(slug)}/packages`,
  );

  return response.data;
}

export async function fetchPublicAddOns(
  slug: string,
  itemType: CatalogItemType,
  itemId: string,
): Promise<unknown> {
  const encodedSlug = encodeURIComponent(slug);
  const encodedItemId = encodeURIComponent(itemId);

  const endpoint =
    itemType === 'service'
      ? `/public/${encodedSlug}/services/${encodedItemId}/addons`
      : `/public/${encodedSlug}/package/${encodedItemId}/addons`;

  const response = await apiClient.get<unknown>(endpoint);
  return response.data;
}
