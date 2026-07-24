import api from './api';

export const reportApi = {
  getAll: async () => {
    const response = await api.get('/api/reports');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/api/reports/${id}`);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/api/reports/${id}`);
    return response.data;
  },
  getHistory: async (biomarker) => {
    const response = await api.get(`/api/reports/history/${encodeURIComponent(biomarker)}`);
    return response.data;
  },
};

