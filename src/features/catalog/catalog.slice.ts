import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { normalizeApiError } from '../../lib/api/api-error';
import type { RootState } from '../../app/store';
import * as catalogService from './catalog.service';
import type {
  CatalogAddOn,
  CatalogItem,
  CatalogState,
  FetchCatalogAddOnsPayload,
  FetchCatalogPayload,
} from './catalog.types';
import {
  getCatalogAddOnsKey,
  normalizeAddOns,
  normalizePackages,
  normalizeServices,
} from './catalog.utils';

const initialState: CatalogState = {
  loadedSlug: null,
  catalogStatus: 'idle',
  services: [],
  packages: [],
  addOnsByItemKey: {},
  addOnsStatusByItemKey: {},
  addOnsErrorByItemKey: {},
  error: null,
};

export const fetchPublicCatalog = createAsyncThunk<
  { services: CatalogItem[]; packages: CatalogItem[] },
  FetchCatalogPayload,
  { rejectValue: ReturnType<typeof normalizeApiError> }
>('catalog/fetchPublicCatalog', async ({ slug }, { rejectWithValue }) => {
  try {
    const [servicesPayload, packagesPayload] = await Promise.all([
      catalogService.fetchPublicServices(slug),
      catalogService.fetchPublicPackages(slug),
    ]);

    return {
      services: normalizeServices(servicesPayload),
      packages: normalizePackages(packagesPayload),
    };
  } catch (error: unknown) {
    return rejectWithValue(normalizeApiError(error));
  }
});

export const fetchCatalogItemAddOns = createAsyncThunk<
  { itemKey: string; addOns: CatalogAddOn[] },
  FetchCatalogAddOnsPayload,
  {
    state: RootState;
    rejectValue: {
      itemKey: string;
      error: ReturnType<typeof normalizeApiError>;
    };
  }
>(
  'catalog/fetchCatalogItemAddOns',
  async ({ slug, itemType, itemId }, { rejectWithValue }) => {
    const itemKey = getCatalogAddOnsKey(slug, itemType, itemId);

    try {
      const payload = await catalogService.fetchPublicAddOns(
        slug,
        itemType,
        itemId,
      );

      return {
        itemKey,
        addOns: normalizeAddOns(payload),
      };
    } catch (error: unknown) {
      return rejectWithValue({
        itemKey,
        error: normalizeApiError(error),
      });
    }
  },
  {
    condition: ({ slug, itemType, itemId, force }, { getState }) => {
      if (force) return true;

      const itemKey = getCatalogAddOnsKey(slug, itemType, itemId);
      const status = getState().catalog.addOnsStatusByItemKey[itemKey];

      return status !== 'loading' && status !== 'succeeded';
    },
  },
);

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    resetCatalog() {
      return initialState;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchPublicCatalog.pending, (state, action) => {
        if (state.loadedSlug && state.loadedSlug !== action.meta.arg.slug) {
          state.services = [];
          state.packages = [];
          state.addOnsByItemKey = {};
          state.addOnsStatusByItemKey = {};
          state.addOnsErrorByItemKey = {};
        }

        state.loadedSlug = action.meta.arg.slug;
        state.catalogStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchPublicCatalog.fulfilled, (state, action) => {
        state.catalogStatus = 'succeeded';
        state.loadedSlug = action.meta.arg.slug;
        state.services = action.payload.services;
        state.packages = action.payload.packages;
        state.error = null;
      })
      .addCase(fetchPublicCatalog.rejected, (state, action) => {
        state.catalogStatus = 'failed';
        state.services = [];
        state.packages = [];
        state.error = action.payload ?? null;
      })
      .addCase(fetchCatalogItemAddOns.pending, (state, action) => {
        const itemKey = getCatalogAddOnsKey(
          action.meta.arg.slug,
          action.meta.arg.itemType,
          action.meta.arg.itemId,
        );

        state.addOnsStatusByItemKey[itemKey] = 'loading';
        state.addOnsErrorByItemKey[itemKey] = null;
      })
      .addCase(fetchCatalogItemAddOns.fulfilled, (state, action) => {
        state.addOnsStatusByItemKey[action.payload.itemKey] = 'succeeded';
        state.addOnsByItemKey[action.payload.itemKey] = action.payload.addOns;
        state.addOnsErrorByItemKey[action.payload.itemKey] = null;
      })
      .addCase(fetchCatalogItemAddOns.rejected, (state, action) => {
        const itemKey =
          action.payload?.itemKey ??
          getCatalogAddOnsKey(
            action.meta.arg.slug,
            action.meta.arg.itemType,
            action.meta.arg.itemId,
          );

        state.addOnsStatusByItemKey[itemKey] = 'failed';
        state.addOnsErrorByItemKey[itemKey] = action.payload?.error ?? null;
      });
  },
});

export const { resetCatalog } = catalogSlice.actions;
export default catalogSlice.reducer;
