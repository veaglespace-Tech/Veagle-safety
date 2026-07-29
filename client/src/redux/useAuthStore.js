import { create } from 'zustand';
import { api } from '../utils/api.js';

export const useAuthStore = create((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('tichi_token') : null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;
      if (typeof window !== 'undefined') localStorage.setItem('tichi_token', token);
      
      // Load saved custom avatar if available
      const savedAvatar = typeof window !== 'undefined' ? localStorage.getItem(`tichi_avatar_${user.id || user.email}`) : null;
      const finalUser = savedAvatar ? { ...user, avatar: savedAvatar } : user;

      set({ token, user: finalUser, isLoading: false });
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
      if (typeof window !== 'undefined') localStorage.setItem('tichi_token', token);
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
    if (typeof window !== 'undefined') localStorage.removeItem('tichi_token');
    set({ user: null, token: null });
  },

  fetchUser: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('tichi_token') : null;
    if (!token) {
      set({ user: null, isLoading: false });
      return;
    }
    try {
      const res = await api.get('/auth/me');
      const fetchedUser = res.data.user;
      
      // Restore saved avatar if exists
      const savedAvatar = typeof window !== 'undefined' ? localStorage.getItem(`tichi_avatar_${fetchedUser.id || fetchedUser.email}`) : null;
      const finalUser = savedAvatar ? { ...fetchedUser, avatar: savedAvatar } : fetchedUser;

      set({ user: finalUser, isLoading: false });
    } catch (err) {
      if (typeof window !== 'undefined') localStorage.removeItem('tichi_token');
      set({ user: null, token: null, isLoading: false });
    }
  },

  updateUserStatus: (safetyStatus) => {
    set((state) => {
      if (!state.user) return state;
      return { user: { ...state.user, safetyStatus } };
    });
  },

  updateUserAvatar: (avatarUrl) => {
    set((state) => {
      if (!state.user) return state;
      const updated = { ...state.user, avatar: avatarUrl };
      if (typeof window !== 'undefined') {
        localStorage.setItem(`tichi_avatar_${state.user.id || state.user.email}`, avatarUrl);
      }
      return { user: updated };
    });
  },
}));
