import { apiClient } from './apiClient.js';

export const adminApi = {
  fetchOverview: async () => {
    const response = await apiClient.get('/admin/overview');
    return response.data;
  },

  fetchUsers: async () => {
    const response = await apiClient.get('/admin/users');
    return response.data;
  },

  updateUserRole: async ({ userId, role }) => {
    const response = await apiClient.put('/admin/user/role', { userId, role });
    return response.data;
  },

  adminResolveSos: async ({ sosSessionId, note }) => {
    const response = await apiClient.post('/admin/sos/resolve', { sosSessionId, note });
    return response.data;
  },

  fetchPlans: async () => {
    const response = await apiClient.get('/admin/plans');
    return response.data;
  },

  savePlan: async (planData) => {
    const response = await apiClient.post('/admin/plans', planData);
    return response.data;
  },

  fetchGstSettings: async () => {
    const response = await apiClient.get('/admin/gst');
    return response.data;
  },

  updateGstSettings: async (gstPercentage) => {
    const response = await apiClient.put('/admin/gst', { gstPercentage });
    return response.data;
  },

  fetchPaymentHistory: async () => {
    const response = await apiClient.get('/admin/payments');
    return response.data;
  },
};
