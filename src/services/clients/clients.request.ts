import apiClient from '../apiClient';
import { ClientProps } from './clients';

export const getClients = async (): Promise<Array<ClientProps>> => {
  await new Promise((resolve) => setTimeout(resolve, 2500));
  const res = await apiClient.get('/clients');
  return res.data;
};

export const postClient = () => {
  console.log('CREAR CLIENTE');
};