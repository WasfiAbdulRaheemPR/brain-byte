import axios, { AxiosError } from 'axios';

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
