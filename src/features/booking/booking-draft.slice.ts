import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CatalogItem } from '../catalog/catalog.types';
import { getCatalogItemKey } from '../catalog/catalog.utils';
import type { BookingDraftState } from './booking-draft.types';

const initialState: BookingDraftState = {
  selectedItem: null,
  selectedAddOnIds: [],
};

const bookingDraftSlice = createSlice({
  name: 'bookingDraft',
  initialState,
  reducers: {
    selectCatalogItem(state, action: PayloadAction<CatalogItem>) {
      const previousKey = state.selectedItem
        ? getCatalogItemKey(state.selectedItem.type, state.selectedItem.id)
        : null;

      const nextKey = getCatalogItemKey(action.payload.type, action.payload.id);

      state.selectedItem = action.payload;

      if (previousKey !== nextKey) {
        state.selectedAddOnIds = [];
      }
    },

    toggleSelectedAddOn(state, action: PayloadAction<string>) {
      const addOnId = action.payload;

      if (state.selectedAddOnIds.includes(addOnId)) {
        state.selectedAddOnIds = state.selectedAddOnIds.filter(
          currentId => currentId !== addOnId,
        );
      } else {
        state.selectedAddOnIds.push(addOnId);
      }
    },

    clearCatalogSelection(state) {
      state.selectedItem = null;
      state.selectedAddOnIds = [];
    },
  },
});

export const {
  selectCatalogItem,
  toggleSelectedAddOn,
  clearCatalogSelection,
} = bookingDraftSlice.actions;

export default bookingDraftSlice.reducer;
