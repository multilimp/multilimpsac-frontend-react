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
  let token;

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

export default apiClient;
