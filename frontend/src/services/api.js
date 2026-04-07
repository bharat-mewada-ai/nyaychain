import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor — centralized error handling
api.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(err.response?.data ?? err.message)
);

export default api;
