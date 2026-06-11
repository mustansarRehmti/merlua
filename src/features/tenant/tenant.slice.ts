import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SetTenantPayload, TenantState } from './tenant.types';
import { normalizeTenantSlug } from './tenant.utils';

const initialState: TenantState = {
  activeSlug: null,
  businessName: null,
};

const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
    setTenant(state, action: PayloadAction<SetTenantPayload>) {
      const nextSlug = normalizeTenantSlug(action.payload.slug);
      const slugChanged = state.activeSlug !== nextSlug;

      state.activeSlug = nextSlug;

      if (action.payload.businessName !== undefined) {
        state.businessName = action.payload.businessName;
      } else if (slugChanged) {
        state.businessName = null;
      }
    },

    clearTenant(state) {
      state.activeSlug = null;
      state.businessName = null;
    },
  },
});

export const { setTenant, clearTenant } = tenantSlice.actions;
export default tenantSlice.reducer;
