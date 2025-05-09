import { parseJSON } from '@/utils/functions';
import apiClient from '../apiClient';
import { ClientProps } from './clients';

export const getClients = async (): Promise<Array<ClientProps>> => {
  const res = await apiClient.get('/clients');

  const arr = Array.isArray(res?.data) ? res.data : [];

  const data = arr.map((item) => ({
    ...item,
    departamento: parseJSON(item.departamento),
    provincia: parseJSON(item.provincia),
    distrito: parseJSON(item.distrito),
  }));

  return data;
};

export const postClient = async (data: Record<string, string | undefined>): Promise<boolean> => {
  const res = await apiClient.post('/clients', data);
  return res.data;
};

export const putClient = async (companyId: number, data: Record<string, string | undefined>): Promise<boolean> => {
  const res = await apiClient.put(`/clients/${companyId}`, data);
  return res.data;
};
