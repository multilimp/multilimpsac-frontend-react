import apiClient from '../apiClient';
import { TransportProps } from './transports';

export const getTransports = async (): Promise<TransportProps[]> => {
  try {
    const response = await apiClient.get('/transports');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching transports:', error);
    return [];
  }
};

export const createTransport = async (transport: Record<string, string | undefined>): Promise<TransportProps> => {
  const response = await apiClient.post('/transports', transport);
  return response.data;
};

export const updateTransport = async (id: number, updates: Partial<TransportProps>): Promise<TransportProps> => {
  const response = await apiClient.put(`/transports/${id}`, updates);
  return response.data;
};

export const deleteTransport = async (id: number): Promise<void> => {
  await apiClient.delete(`/transports/${id}`);
};
