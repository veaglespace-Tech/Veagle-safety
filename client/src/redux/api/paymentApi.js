import { apiClient } from './apiClient.js';

export const paymentApi = {
  initiatePayU: async ({ planId }) => {
    const response = await apiClient.post('/payment/payu-initiate', { planId });
    return response.data;
  },

  fetchPaymentHistory: async () => {
    const response = await apiClient.get('/payment/history');
    return response.data;
  },
};
