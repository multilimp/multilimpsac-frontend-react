import apiClient from '../apiClient';
import { ClientProps } from './clients';

export const getClients = async (): Promise<Array<ClientProps>> => {
  const res = await apiClient.get('/clients');

  const arr = Array.isArray(res?.data) ? res.data : [];

  const data = arr.map((item) => ({
    ...item,
    departamento: item.departamento ? JSON.parse(item.departamento) : null,
    provincia: item.provincia ? JSON.parse(item.provincia) : null,
    distrito: item.distrito ? JSON.parse(item.distrito) : null,
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
