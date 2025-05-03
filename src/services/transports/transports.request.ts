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

export const createTransport = async (transport: Omit<TransportProps, 'id'>): Promise<TransportProps> => {
  const response = await apiClient.post('/transports', transport);
  return response.data;
};

export const updateTransport = async (id: string, updates: Partial<TransportProps>): Promise<TransportProps> => {
  const response = await apiClient.patch(`/transports/${id}`, updates);
  return response.data;
};

export const deleteTransport = async (id: string): Promise<void> => {
  await apiClient.delete(`/transports/${id}`);
};