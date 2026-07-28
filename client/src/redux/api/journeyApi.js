import { apiClient } from './apiClient.js';

export const journeyApi = {
  startJourney: async (journeyData) => {
    const response = await apiClient.post('/journey/start', journeyData);
    return response.data;
  },

  completeJourney: async (journeyId) => {
    const response = await apiClient.post('/journey/complete', { journeyId });
    return response.data;
  },

  getActiveJourney: async () => {
    const response = await apiClient.get('/journey/active');
    return response.data;
  },

  startCheckin: async (intervalMins) => {
    const response = await apiClient.post('/checkin/start', { intervalMins });
    return response.data;
  },

  confirmCheckinSafe: async (checkinId) => {
    const response = await apiClient.post('/checkin/safe', { checkinId });
    return response.data;
  },

  getActiveCheckin: async () => {
    const response = await apiClient.get('/checkin/active');
    return response.data;
  },
};
