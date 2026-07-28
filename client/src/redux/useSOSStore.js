import { create } from 'zustand';
import { api } from '../utils/api.js';
import { useAuthStore } from './useAuthStore.js';

export const useSOSStore = create((set, get) => ({
  activeSession: null,
  isActivating: false,
  isAlarmPlaying: false,
  error: null,

  triggerSos: async (isSilent = false, lat, lng) => {
    set({ isActivating: true, error: null });
    try {
      const res = await api.post('/sos/start', {
        isSilent,
        initialLat: lat,
        initialLng: lng,
      });

      const { sosSession } = res.data;
      set({ activeSession: sosSession, isActivating: false });
      useAuthStore.getState().updateUserStatus('SOS_ACTIVE');

      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([200, 100, 200, 100, 400]);
      }

      return true;
    } catch (err) {
      set({
        error: err.response?.data?.error || 'Failed to trigger emergency alert.',
        isActivating: false,
      });
      return false;
    }
  },

  resolveSos: async () => {
    const { activeSession } = get();
    if (!activeSession) return true;

    try {
      await api.post('/sos/resolve', { sosSessionId: activeSession.id });
      set({ activeSession: null, isAlarmPlaying: false });
      useAuthStore.getState().updateUserStatus('SAFE');
      return true;
    } catch (err) {
      set({ error: 'Failed to resolve emergency session.' });
      return false;
    }
  },

  fetchActiveSos: async () => {
    try {
      const res = await api.get('/sos/active');
      if (res.data.session) {
        set({
          activeSession: {
            id: res.data.session.id,
            shareToken: res.data.session.shareToken,
            startedAt: res.data.session.startedAt,
            trackingUrl: `/live-track/${res.data.session.shareToken}`,
          },
        });
      } else {
        set({ activeSession: null });
      }
    } catch (err) {
      set({ activeSession: null });
    }
  },

  toggleAlarm: () => set((state) => ({ isAlarmPlaying: !state.isAlarmPlaying })),
}));
