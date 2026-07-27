import { create } from 'zustand';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  status: 'LIVE' | 'STALE' | 'OFFLINE' | 'DENIED';
  lastUpdated: Date | null;
  watchId: number | null;
  startTracking: () => void;
  stopTracking: () => void;
  setLocation: (lat: number, lng: number, accuracy?: number) => void;
}

export const useLocationStore = create<LocationState>((set, get) => ({
  latitude: 28.6139, // Default location (New Delhi) if GPS warming up
  longitude: 77.2090,
  accuracy: 12,
  status: 'LIVE',
  lastUpdated: new Date(),
  watchId: null,

  startTracking: () => {
    if (!navigator.geolocation) {
      set({ status: 'OFFLINE' });
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        set({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: Math.round(pos.coords.accuracy),
          status: 'LIVE',
          lastUpdated: new Date(),
        });
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          set({ status: 'DENIED' });
        } else {
          set({ status: 'STALE' });
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      }
    );

    set({ watchId: id });
  },

  stopTracking: () => {
    const { watchId } = get();
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      set({ watchId: null });
    }
  },

  setLocation: (lat, lng, accuracy = 10) => {
    set({
      latitude: lat,
      longitude: lng,
      accuracy,
      status: 'LIVE',
      lastUpdated: new Date(),
    });
  },
}));
