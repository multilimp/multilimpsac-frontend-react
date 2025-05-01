import apiClient from '../apiClient';
import { SaleProps } from './sales';

export const getSales = async (): Promise<SaleProps[]> => {
  const response = await apiClient.get('/sales');
  return response.data;
};

export const createSale = async (sale: Omit<SaleProps, 'id'>): Promise<SaleProps> => {
  const response = await apiClient.post('/sales', sale);
  return response.data;
};

export const generateInvoice = async (saleId: string): Promise<{ pdfUrl: string }> => {
  const response = await apiClient.get(`/sales/${saleId}/invoice`);
  return response.data;
};