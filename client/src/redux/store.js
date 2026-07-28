import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import sosReducer from './slices/sosSlice.js';
import planReducer from './slices/planSlice.js';
import adminReducer from './slices/adminSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    sos: sosReducer,
    plan: planReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
