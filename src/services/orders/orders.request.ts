import apiClient from '../apiClient';
import { OrderProps } from './orders';

export const getOrders = async (): Promise<OrderProps[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Delay de 1 segundo
  try {
    const response = await apiClient.get('/orders');
    // Fuerza la conversión a array si es necesario
    return Array.isArray(response?.data) ? response.data : [];
  } catch (error) {
    console.error('Error en getOrders:', error);
    return []; // Devuelve array vacío si hay error
  }
};

// Operaciones CRUD (sin cambios)
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