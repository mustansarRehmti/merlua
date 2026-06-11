import { configureStore } from '@reduxjs/toolkit';
import customerAuthReducer from '../features/auth/auth.slice';
import tenantReducer from '../features/tenant/tenant.slice';
import catalogReducer from '../features/catalog/catalog.slice';
import bookingDraftReducer from '../features/booking/booking-draft.slice';

export const store = configureStore({
  reducer: {
    customerAuth: customerAuthReducer,
    tenant: tenantReducer,
    catalog: catalogReducer,
    bookingDraft: bookingDraftReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
