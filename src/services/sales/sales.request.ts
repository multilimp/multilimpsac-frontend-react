import apiClient from '../apiClient';
import { SaleProps } from './sales';

export const getSales = async (): Promise<SaleProps[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  try {
    const response = await apiClient.get('/sales');
    return Array.isArray(response?.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching sales:', error);
    return [];
  }
};

export const createSale = async (sale: Omit<SaleProps, 'id'>): Promise<SaleProps> => {
  const response = await apiClient.post('/sales', sale);
  return response.data;
};

export const generateInvoice = async (saleId: string): Promise<{ pdfUrl: string }> => {
  const response = await apiClient.get(`/sales/${saleId}/invoice`);
  return response.data;
};