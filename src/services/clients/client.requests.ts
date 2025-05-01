import apiClient from '../apiClient';
import { ClientProps } from './client';

export const getClients = async (): Promise<Array<ClientProps>> => {
  const res = await apiClient.get('/clients');
  return res.data;
};

export const postClient = async (data: Record<string, string>): Promise<boolean> => {
  const res = await apiClient.post('/clients', data);
  return res.data;
};

export const putClient = async (companyId: number, data: Record<string, string>): Promise<boolean> => {
  const res = await apiClient.put(`/clients/${companyId}`, data);
  return res.data;
};
