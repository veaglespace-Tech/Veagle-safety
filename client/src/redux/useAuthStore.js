import { create } from 'zustand';
import { api } from '../utils/api.js';

const getSavedUser = () => {
  if (typeof window === 'undefined') return null;
  try {
    const u = localStorage.getItem('tichi_user');
    return u ? JSON.parse(u) : null;
  } catch (e) {
    return null;
  }
};

const saveUserLocally = (user) => {
  if (typeof window !== 'undefined' && user) {
    try {
      localStorage.setItem('tichi_user', JSON.stringify(user));
    } catch (e) {}
  }
};

export const useAuthStore = create((set) => ({
  user: getSavedUser(),
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

      saveUserLocally(finalUser);
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
      
      saveUserLocally(user);
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
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tichi_token');
      localStorage.removeItem('tichi_user');
    }
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

      saveUserLocally(finalUser);
      set({ user: finalUser, isLoading: false });
    } catch (err) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('tichi_token');
        localStorage.removeItem('tichi_user');
      }
      set({ user: null, token: null, isLoading: false });
    }
  },

  updateUserStatus: (safetyStatus) => {
    set((state) => {
      if (!state.user) return state;
      const updated = { ...state.user, safetyStatus };
      saveUserLocally(updated);
      return { user: updated };
    });
  },

  updateUserAvatar: (avatarUrl) => {
    set((state) => {
      if (!state.user) return state;
      const updated = { ...state.user, avatar: avatarUrl };
      if (typeof window !== 'undefined') {
        if (avatarUrl) {
          localStorage.setItem(`tichi_avatar_${state.user.id || state.user.email}`, avatarUrl);
        } else {
          localStorage.removeItem(`tichi_avatar_${state.user.id || state.user.email}`);
        }
      }
      saveUserLocally(updated);
      return { user: updated };
    });
  },
}));
