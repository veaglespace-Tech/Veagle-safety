import { apiClient } from './apiClient.js';

export const authApi = {
  register: async (formData) => {
    const response = await apiClient.post('/auth/register', formData);
    return response.data;
  },

  verifyEmail: async ({ email, otp, pendingToken }) => {
    const response = await apiClient.post('/auth/verify-email', { email, otp, pendingToken });
    return response.data;
  },

  resendOtp: async (email) => {
    const response = await apiClient.post('/auth/resend-otp', { email });
    return response.data;
  },

  login: async ({ email, password }) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  updateSettings: async (settingsData) => {
    const response = await apiClient.put('/auth/settings', settingsData);
    return response.data;
  },
};
