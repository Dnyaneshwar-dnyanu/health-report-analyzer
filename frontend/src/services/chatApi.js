import api from './api';

export const chatApi = {
  ask: async (question, reportId) => {
    const response = await api.post('/api/chat', {
      question,
      report_id: reportId || null,
    });
    return response.data;
  },
};
