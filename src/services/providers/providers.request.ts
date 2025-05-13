import { parseJSON } from '@/utils/functions';
import apiClient from '../apiClient';
import { ProviderProps } from './providers';

export const getProviders = async (): Promise<ProviderProps[]> => {
  try {
    const response = await apiClient.get('/providers');

    const arr = Array.isArray(response?.data) ? response.data : [];

    const data = arr.map((item) => ({
      ...item,
      departamento: parseJSON(item.departamento),
      provincia: parseJSON(item.provincia),
      distrito: parseJSON(item.distrito),
    }));

    return data;
  } catch (error) {
    console.error('Error fetching providers:', error);
    return [];
  }
};

export const createProvider = async (provider: Record<string, string | undefined>): Promise<ProviderProps> => {
  try {
    const response = await apiClient.post('/providers', provider);
    return response.data;
  } catch (error) {
    console.error('Error creating provider:', error);
    throw new Error('No se pudo crear el proveedor');
  }
};

export const updateProvider = async (id: number, updates: Partial<ProviderProps>): Promise<ProviderProps> => {
  try {
    const response = await apiClient.put(`/providers/${id}`, updates);
    return response.data;
  } catch (error) {
    console.error('Error updating provider:', error);
    throw new Error('No se pudo actualizar el proveedor');
  }
};

export const deleteProvider = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/providers/${id}`);
  } catch (error) {
    console.error('Error deleting provider:', error);
    throw new Error('No se pudo eliminar el proveedor');
  }
};

export const searchProviderByRuc = async (ruc: string): Promise<ProviderProps | null> => {
  try {
    const response = await apiClient.get(`/providers/search?ruc=${ruc}`);
    return response.data ?? null;
  } catch (error) {
    console.error('Error searching provider:', error);
    return null;
  }
};
