import axios, { InternalAxiosRequestConfig } from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_API_HOST_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const interceptor = async (config: InternalAxiosRequestConfig<any>) => {
  let token;
  const newConfig = config;
  newConfig.headers.Authorization = token;
  return newConfig;
};

apiClient.interceptors.request.use(interceptor);

export default apiClient;
