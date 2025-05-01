import apiClient from '../apiClient';
import { OrderProps } from './orders';

export const getOrders = async (): Promise<OrderProps[]> => {
  const response = await apiClient.get('/orders');
  return response.data;
};

export const createOrder = async (order: Omit<OrderProps, 'id'>): Promise<OrderProps> => {
  const response = await apiClient.post('/orders', order);
  return response.data;
};

export const updateOrder = async (id: string, updates: Partial<OrderProps>): Promise<OrderProps> => {
  const response = await apiClient.patch(`/orders/${id}`, updates);
  return response.data;
};

export const cancelOrder = async (id: string): Promise<void> => {
  await apiClient.delete(`/orders/${id}`);
};