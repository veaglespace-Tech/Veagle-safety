import { apiClient } from './apiClient.js';

export const volunteerApi = {
  // Public Registration & Verification
  sendOtp: async (data) => {
    const response = await apiClient.post('/volunteers/send-otp', data);
    return response.data;
  },

  verifyOtp: async (data) => {
    const response = await apiClient.post('/volunteers/verify-otp', data);
    return response.data;
  },

  applyVolunteer: async (data) => {
    const response = await apiClient.post('/volunteers/apply', data);
    return response.data;
  },

  // SuperAdmin Operations
  getAllVolunteers: async (params = {}) => {
    const response = await apiClient.get('/admin/volunteers', { params });
    return response.data;
  },

  getVolunteerById: async (id) => {
    const response = await apiClient.get(`/admin/volunteers/${id}`);
    return response.data;
  },

  approveVolunteer: async (id) => {
    const response = await apiClient.post(`/admin/volunteers/${id}/approve`);
    return response.data;
  },

  rejectVolunteer: async (id, data = {}) => {
    const response = await apiClient.post(`/admin/volunteers/${id}/reject`, data);
    return response.data;
  },

  updateVolunteer: async (id, data) => {
    const response = await apiClient.put(`/admin/volunteers/${id}`, data);
    return response.data;
  },

  deleteVolunteer: async (id) => {
    const response = await apiClient.delete(`/admin/volunteers/${id}`);
    return response.data;
  },
};
