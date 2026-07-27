import { create } from 'zustand';

export const useLocationStore = create((set) => ({
  latitude: null,
  longitude: null,
  accuracy: null,
  status: 'OFFLINE',
  watchId: null,

  startTracking: () => {
    if (!('geolocation' in navigator)) {
      set({ status: 'DENIED' });
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        set({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: Math.round(pos.coords.accuracy),
          status: 'LIVE',
        });
      },
      (err) => {
        console.warn('Geolocation warning:', err.message);
        set({ status: 'DENIED' });
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 5000,
      }
    );

    set({ watchId });
  },

  stopTracking: () => {
    set((state) => {
      if (state.watchId !== null) {
        navigator.geolocation.clearWatch(state.watchId);
      }
      return { watchId: null, status: 'OFFLINE' };
    });
  },
}));
