import type { ApiErrorResponse } from '../../lib/api/api.types';

export type CatalogItemType = 'service' | 'package';
export type CatalogLoadStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface CatalogConsentTemplate {
  id: string;
  name: string;
  description?: string | null;
  htmlContent?: string | null;
}

export interface CatalogAddOn {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  priceCents: number;
  imageUrl: string | null;
}

export interface CatalogItem {
  id: string;
  type: CatalogItemType;
  name: string;
  description: string;
  durationMinutes: number;
  priceCents: number;
  imageUrl: string | null;
  categoryName: string | null;

  consentTemplateId?: string | null;
  consentTemplate?: CatalogConsentTemplate | null;

  services?: CatalogItem[];
}

export interface CatalogState {
  loadedSlug: string | null;
  catalogStatus: CatalogLoadStatus;
  services: CatalogItem[];
  packages: CatalogItem[];
  addOnsByItemKey: Record<string, CatalogAddOn[]>;
  addOnsStatusByItemKey: Record<string, CatalogLoadStatus>;
  addOnsErrorByItemKey: Record<string, ApiErrorResponse | null>;
  error: ApiErrorResponse | null;
}

export interface FetchCatalogPayload {
  slug: string;
}

export interface FetchCatalogAddOnsPayload {
  slug: string;
  itemId: string;
  itemType: CatalogItemType;
  force?: boolean;
}
