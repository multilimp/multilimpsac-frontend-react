import apiClient from '../apiClient';
import { ClientProps } from './clients';

export const getClients = async (): Promise<Array<ClientProps>> => {
  const res = await apiClient.get('/clients');
  return res.data;
};

export const postClient = () => {
  console.log('CREAR CLIENTE');
};
