import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.229.247.254:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - attach JWT token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('odeshie_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('odeshie_token');
      localStorage.removeItem('odeshie_user');
      // Only redirect if not already on auth pages
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
