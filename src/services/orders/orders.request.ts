import apiClient from '../apiClient';
import { OrderProps } from './orders';

export const getOrders = async (): Promise<OrderProps[]> => {
  const res = await apiClient.get('/orders');
  return Array.isArray(res.data) ? res.data : [];
};

export const createOrder = async (
  data: Omit<OrderProps, 'id'>
): Promise<OrderProps> => {
  const res = await apiClient.post('/orders', data);
  return res.data;
};

export const updateOrder = async (
  id: string | number,
  updates: Partial<Omit<OrderProps, 'id'>>
): Promise<OrderProps> => {
  const res = await apiClient.put(`/orders/${id}`, updates);
  return res.data;
};

export const cancelOrder = async (id: string | number): Promise<void> => {
  await apiClient.delete(`/orders/${id}`);
};
