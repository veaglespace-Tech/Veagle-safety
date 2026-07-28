import { apiClient } from './apiClient.js';

export const contactsApi = {
  getContacts: async () => {
    const response = await apiClient.get('/contacts');
    return response.data;
  },

  addContact: async (contactData) => {
    const response = await apiClient.post('/contacts', contactData);
    return response.data;
  },

  deleteContact: async (contactId) => {
    const response = await apiClient.delete(`/contacts/${contactId}`);
    return response.data;
  },
};
