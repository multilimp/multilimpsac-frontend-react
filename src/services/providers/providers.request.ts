import apiClient from '../apiClient';
import { ProviderProps } from './providers';

export const getProviders = async (): Promise<ProviderProps[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Delay de 1 segundo para simulación
  
  try {
    const response = await apiClient.get('/providers');
    // Asegura que siempre retorne un array
    return Array.isArray(response?.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching providers:', error);
    return []; // Retorna array vacío en caso de error
  }
};

export const createProvider = async (provider: Omit<ProviderProps, 'id'>): Promise<ProviderProps> => {
  try {
    const response = await apiClient.post('/providers', provider);
    return response.data;
  } catch (error) {
    console.error('Error creating provider:', error);
    throw new Error('No se pudo crear el proveedor');
  }
};

export const updateProvider = async (id: string, updates: Partial<ProviderProps>): Promise<ProviderProps> => {
  try {
    const response = await apiClient.patch(`/providers/${id}`, updates);
    return response.data;
  } catch (error) {
    console.error('Error updating provider:', error);
    throw new Error('No se pudo actualizar el proveedor');
  }
};

export const deleteProvider = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/providers/${id}`);
  } catch (error) {
    console.error('Error deleting provider:', error);
    throw new Error('No se pudo eliminar el proveedor');
  }
};

// Búsqueda especializada por RUC
export const searchProviderByRuc = async (ruc: string): Promise<ProviderProps | null> => {
  try {
    const response = await apiClient.get(`/providers/search?ruc=${ruc}`);
    return response.data || null;
  } catch (error) {
    console.error('Error searching provider:', error);
    return null;
  }
};