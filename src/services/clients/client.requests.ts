
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
    // Ensure all required fields are present
    codigoUnidadEjecutora: item.codigoUnidadEjecutora || '',
    createdAt: item.createdAt || new Date().toISOString(),
    direccion: item.direccion || '',
    email: item.email,
    estado: item.estado || true,
    razonSocial: item.razonSocial || '',
    ruc: item.ruc || '',
    telefono: item.telefono,
    updatedAt: item.updatedAt || new Date().toISOString(),
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
