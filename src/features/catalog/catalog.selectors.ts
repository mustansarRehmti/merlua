import type { RootState } from '../../app/store';
import type { CatalogItemType } from './catalog.types';
import { getCatalogAddOnsKey } from './catalog.utils';

export const selectLoadedCatalogSlug = (state: RootState) => state.catalog.loadedSlug;

export const selectCatalogStatus = (state: RootState) =>
  state.catalog.catalogStatus;

export const selectCatalogError = (state: RootState) => state.catalog.error;

export const selectServices = (state: RootState) => state.catalog.services;

export const selectPackages = (state: RootState) => state.catalog.packages;

export const selectCatalogAddOns = (
  state: RootState,
  slug: string,
  itemType: CatalogItemType,
  itemId: string,
) => state.catalog.addOnsByItemKey[getCatalogAddOnsKey(slug, itemType, itemId)] ?? [];

export const selectCatalogAddOnsStatus = (
  state: RootState,
  slug: string,
  itemType: CatalogItemType,
  itemId: string,
) =>
  state.catalog.addOnsStatusByItemKey[getCatalogAddOnsKey(slug, itemType, itemId)] ??
  'idle';

export const selectCatalogAddOnsError = (
  state: RootState,
  slug: string,
  itemType: CatalogItemType,
  itemId: string,
) => state.catalog.addOnsErrorByItemKey[getCatalogAddOnsKey(slug, itemType, itemId)] ?? null;
