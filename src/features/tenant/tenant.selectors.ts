import type { RootState } from '../../app/store';

export const selectActiveTenantSlug = (state: RootState) =>
  state.tenant.activeSlug;

export const selectActiveBusinessName = (state: RootState) =>
  state.tenant.businessName;
