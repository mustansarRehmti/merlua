import type { RootState } from '../../app/store';

export const selectDraftCatalogItem = (state: RootState) =>
  state.bookingDraft.selectedItem;

export const selectDraftAddOnIds = (state: RootState) =>
  state.bookingDraft.selectedAddOnIds;
