import { create } from 'zustand';
import { api } from '../utils/api.js';

export const useAuthStore = create((set) => ({
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
    } catch (err) {
      set({
        error: err.response?.data?.error || 'Login failed. Please check credentials.',
        isLoading: false,
      });
      return false;
    }
  },

  register: async (fullName, email, phone, password, role = 'USER') => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/register', { fullName, email, phone, password, role });
      const { token, user } = res.data;
      localStorage.setItem('tichi_token', token);
      set({ token, user, isLoading: false });
      return true;
    } catch (err) {
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
