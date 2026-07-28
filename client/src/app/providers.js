'use client';

import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from '../redux/store.js';
import { fetchUser } from '../redux/slices/authSlice.js';
import { EmergencyAlarmListener } from '../components/common/EmergencyAlarmListener.js';

function AuthInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <>
      <EmergencyAlarmListener />
      {children}
    </>
  );
}

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  );
}
