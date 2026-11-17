import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
export const TOKEN_KEY = 'token';
export const USERNAME_KEY = 'username';

const client = axios.create({ baseURL: `${API_URL}/api/v1` });

// attach the JWT to every request as a Bearer token
client.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// a 401 on a request that carried a token means the session expired or is invalid;
// a 401 without a token (wrong login password) is handled by the login form instead
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.config?.headers?.Authorization) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USERNAME_KEY);
      window.dispatchEvent(new Event('auth:expired'));
    }
    return Promise.reject(error);
  }
);

export default client;