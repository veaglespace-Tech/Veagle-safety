import { create } from 'zustand';
import { api } from '../utils/api';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  safetyStatus: 'SAFE' | 'SOS_ACTIVE' | 'JOURNEY_ACTIVE';
  quickSosMode: 'STANDARD' | 'SILENT';
  onboardingStep: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (fullName: string, email: string, phone: string, pass: string) => Promise<boolean>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  updateUserStatus: (status: 'SAFE' | 'SOS_ACTIVE' | 'JOURNEY_ACTIVE') => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('tichi_token'),
  isLoading: true,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;
      localStorage.setItem('tichi_token', token);
      set({ token, user, isLoading: false });
      return true;
    } catch (err: any) {
      set({
        error: err.response?.data?.error || 'Login failed. Please check credentials.',
        isLoading: false,
      });
      return false;
    }
  },

  register: async (fullName, email, phone, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/register', { fullName, email, phone, password });
      const { token, user } = res.data;
      localStorage.setItem('tichi_token', token);
      set({ token, user, isLoading: false });
      return true;
    } catch (err: any) {
      set({
        error: err.response?.data?.error || 'Registration failed.',
        isLoading: false,
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('tichi_token');
    set({ user: null, token: null });
  },

  fetchUser: async () => {
    const token = localStorage.getItem('tichi_token');
    if (!token) {
      set({ user: null, isLoading: false });
      return;
    }
    try {
      const res = await api.get('/auth/me');
      set({ user: res.data.user, isLoading: false });
    } catch (err) {
      localStorage.removeItem('tichi_token');
      set({ user: null, token: null, isLoading: false });
    }
  },

  updateUserStatus: (safetyStatus) => {
    set((state) => (state.user ? { user: { ...state.user, safetyStatus } } : state));
  },
}));
