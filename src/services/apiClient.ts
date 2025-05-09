import axios, { InternalAxiosRequestConfig } from 'axios';
import StorageService from './storageService';
import { STORAGE_KEY } from '@/utils/constants';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_API_HOST_URL,
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

  const newConfig = config;
  newConfig.headers.Authorization = token;
  return newConfig;
};

apiClient.interceptors.request.use(interceptor);

export default apiClient;
