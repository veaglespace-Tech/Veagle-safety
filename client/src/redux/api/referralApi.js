import { apiClient } from './apiClient.js';

export const referralApi = {
  createPartner: async (data) => {
    const response = await apiClient.post('/partners', data);
    return response.data;
  },

  getAllPartners: async () => {
    const response = await apiClient.get('/partners');
    return response.data;
  },

  getPartnerById: async (id) => {
    const response = await apiClient.get(`/partners/${id}`);
    return response.data;
  },

  updatePartner: async (id, data) => {
    const response = await apiClient.put(`/partners/${id}`, data);
    return response.data;
  },

  deletePartner: async (id) => {
    const response = await apiClient.delete(`/partners/${id}`);
    return response.data;
  },

  getPartnerStats: async (email, code) => {
    const response = await apiClient.post('/partners/stats', { email, code });
    return response.data;
  },

  applyPartner: async (data) => {
    const response = await apiClient.post('/partners/apply', data);
    return response.data;
  },

  getPartnerApplications: async () => {
    const response = await apiClient.get('/partners/applications');
    return response.data;
  },

  approvePartnerApplication: async (id, data) => {
    const response = await apiClient.post(`/partners/approve-application/${id}`, data);
    return response.data;
  },

  loginPartner: async (credentials) => {
    const response = await apiClient.post('/partners/login', credentials);
    return response.data;
  },

  getPartnerDashboard: async (customToken) => {
    const token = customToken || (typeof window !== 'undefined' ? localStorage.getItem('partner_token') : null);
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await apiClient.get('/partners/me', config);
    return response.data;
  },

  updatePartnerProfile: async (data, customToken) => {
    const token = customToken || (typeof window !== 'undefined' ? localStorage.getItem('partner_token') : null);
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await apiClient.put('/partners/me', data, config);
    return response.data;
  },
};
