import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Settings API (MongoDB)
export const getSettings = () => api.get('/settings');
export const updateSettings = (settings) => api.put('/settings', settings);
export const resetSettings = () => api.post('/settings/reset');

// Usage API (MongoDB)
export const logUsage = (data) => api.post('/usage/log', data);
export const getUsageStats = (period = '7d') => api.get(`/usage/stats?period=${period}`);
export const getRecentLogs = (limit = 50) => api.get(`/usage/recent?limit=${limit}`);

// Team API
export const getTeam = () => api.get('/team');

// Components API
export const getComponents = () => api.get('/components');

// ========== ESP32 Real-Time APIs ==========
export const getESP32Status = () => api.get('/esp32/status');
export const getESP32Settings = () => api.get('/esp32/settings');
export const updateESP32Settings = (settings) => api.post('/esp32/settings', settings);
export const getESP32Stats = () => api.get('/esp32/stats');
export const resetESP32Stats = () => api.post('/esp32/stats/reset');
export const getESP32Info = () => api.get('/esp32/info');

export default api;