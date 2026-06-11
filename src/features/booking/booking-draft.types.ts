import type { CatalogItem } from '../catalog/catalog.types';

export interface BookingDraftState {
  selectedItem: CatalogItem | null;
  selectedAddOnIds: string[];
}
