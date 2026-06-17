import { configureStore } from '@reduxjs/toolkit';
import customerAuthReducer from '../features/auth/auth.slice';
import tenantReducer from '../features/tenant/tenant.slice';
import catalogReducer from '../features/catalog/catalog.slice';
import bookingDraftReducer from '../features/booking/booking-draft.slice';
import bookingSubmitReducer from '../features/booking-submit/booking-submit.slice';

export const store = configureStore({
  reducer: {
    customerAuth: customerAuthReducer,
    tenant: tenantReducer,
    catalog: catalogReducer,
    bookingDraft: bookingDraftReducer,
    bookingSubmit: bookingSubmitReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
