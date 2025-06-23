import apiClient from '../apiClient';
import { ProviderOrderProps } from './providerOrders';

export const getOrderProvider = async (saleId: number): Promise<Array<ProviderOrderProps>> => {
  const response = await apiClient.get(`/ordenes-proveedores/${saleId}/op`);
  return response.data;
};

export const createOrderProvider = async (saleId: number, data: Record<string, any>) => {
  const response = await apiClient.post(`/ordenes-proveedores/${saleId}/op`, data);
  return response.data;
};

export const getOrderProvidersByOC = async (saleId: number) => {
  const response = await apiClient.get(`/ordenes-proveedores/${saleId}/codigos`);
  return response.data;
};

export const getOrderProviderById = async (ordenProveedorId: number): Promise<ProviderOrderProps> => {
  const response = await apiClient.get(`/ordenes-proveedores/op/${ordenProveedorId}`);
  return response.data;
};

export const updateOrderProvider = async (ordenProveedorId: number, data: Record<string, any>): Promise<ProviderOrderProps> => {
  const response = await apiClient.put(`/ordenes-proveedores/op/${ordenProveedorId}`, data);
  return response.data;
};
