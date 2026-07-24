import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 60000, // 60 seconds (needed for PDF OCR parsing on CPU)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for formatting error details cleanly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Network Error:', error.response || error);
    const detailMsg = error.response?.data?.detail || error.message || 'Network request failed.';
    return Promise.reject(new Error(detailMsg));
  }
);

export default api;
