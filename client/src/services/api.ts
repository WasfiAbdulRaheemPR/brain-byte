import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach Authorization header if token exists in localStorage
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    try {
      const token = localStorage.getItem('civic_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Ignore localStorage access issues in restricted environments
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle token expiration or invalid session cleanup
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      // If unauthorized on auth check, purge stored credentials
      if (url.includes('/auth/me')) {
        try {
          localStorage.removeItem('civic_token');
          localStorage.removeItem('civic_user');
        } catch {
          // ignore
        }
      }
    }
    return Promise.reject(error);
  }
);

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const serverMessage = error.response?.data?.message;
    if (typeof serverMessage === 'string') return serverMessage;
    if (Array.isArray(error.response?.data?.errors)) {
      return error.response.data.errors.map((e: { message?: string }) => e.message).filter(Boolean).join(', ');
    }
    return error.message || 'An unexpected server error occurred';
  }
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred';
}
