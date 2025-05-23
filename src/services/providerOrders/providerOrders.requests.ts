import apiClient from '../apiClient';
import { ProviderOrderProps } from './providerOrders';

export const getOrderProvider = async (saleId: number): Promise<Array<ProviderOrderProps>> => {
  const response = await apiClient.get(`/ordenes-proveedor/${saleId}/op`);
  return response.data;
};

export const createOrderProvider = async (saleId: number, data: Record<string, any>) => {
  const response = await apiClient.post(`/ordenes-proveedor/${saleId}/op`, data);
  return response.data;
};
