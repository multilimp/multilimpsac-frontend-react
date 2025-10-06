
import axios, { InternalAxiosRequestConfig } from 'axios';
import StorageService from './storageService';
import { STORAGE_KEY } from '@/utils/constants';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_API_HOST_URL ?? 'https://multilimpsac.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

const interceptor = async (config: InternalAxiosRequestConfig<any>) => {
  let token = '';

  const rawToken = StorageService.get(STORAGE_KEY);
  if (rawToken) {
    token = `Bearer ${rawToken}`;
  }

  if (config.headers) {
    (config.headers as Record<string, string>)['Authorization'] = token;
  }
  
  return config;
};

apiClient.interceptors.request.use(interceptor);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      StorageService.delete(STORAGE_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
