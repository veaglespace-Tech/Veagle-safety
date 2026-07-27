import { create } from 'zustand';
import { api } from '../utils/api';
import { useAuthStore } from './useAuthStore';

export interface SosSessionData {
  id: string;
  shareToken: string;
  startedAt: string;
  isSilent: boolean;
  trackingUrl: string;
}

interface SOSState {
  activeSession: SosSessionData | null;
  isActivating: boolean;
  isAlarmPlaying: boolean;
  error: string | null;
  triggerSos: (isSilent?: boolean, lat?: number, lng?: number) => Promise<boolean>;
  resolveSos: () => Promise<boolean>;
  fetchActiveSos: () => Promise<void>;
  toggleAlarm: (play?: boolean) => void;
}

export const useSOSStore = create<SOSState>((set, get) => ({
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

      // Vibrate phone if supported
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200, 100, 400]);
      }

      return true;
    } catch (err: any) {
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
            isSilent: res.data.session.isSilent,
            trackingUrl: `http://localhost:5173/track/${res.data.session.shareToken}`,
          },
        });
        useAuthStore.getState().updateUserStatus('SOS_ACTIVE');
      }
    } catch (err) {
      console.error('Failed to fetch active SOS state');
    }
  },

  toggleAlarm: (play) => {
    set((state) => ({ isAlarmPlaying: play !== undefined ? play : !state.isAlarmPlaying }));
  },
}));
