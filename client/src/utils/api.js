import axios from 'axios';

export const SERVER_URL = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SERVER_URL) || 'http://localhost:5000';
export const API_URL = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) || `${SERVER_URL}/api`;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('tichi_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});


