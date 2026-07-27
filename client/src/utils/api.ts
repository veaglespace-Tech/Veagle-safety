import axios from 'axios';

export const API_URL = 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tichi_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
