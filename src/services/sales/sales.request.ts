import { parseJSON } from '@/utils/functions';
import apiClient from '../apiClient';
import { SaleFiltersProps, SaleProps } from './sales';

export const getSales = async (params?: SaleFiltersProps): Promise<SaleProps[]> => {
  const response = await apiClient.get('/ventas', { params });
  const aux = response.data?.data;
  const data = Array.isArray(aux) ? aux : [];

  const formatted = data.map((item) => ({
    ...item,
    departamentoEntrega: parseJSON(item.departamentoEntrega),
    provinciaEntrega: parseJSON(item.provinciaEntrega),
    distritoEntrega: parseJSON(item.distritoEntrega),
  }));

  return formatted;
};

export const createDirectSale = async (sale: Record<string, any>): Promise<SaleProps> => {
  const response = await apiClient.post('/ventas', sale);
  return response.data;
};

export const createPrivateSale = async (sale: Record<string, any>): Promise<SaleProps> => {
  const response = await apiClient.post('/ventas/privada', sale);
  return response.data;
};

export const processPdfSales = async (file: File) => {
  const form = new FormData();
  form.append('pdfFile', file);

  const res = await apiClient.post('/ventas/analyze-pdf', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data;
};

export const generateInvoice = async (saleId: string): Promise<{ pdfUrl: string }> => {
  const response = await apiClient.get(`/ventas/${saleId}/invoice`);
  return response.data;
};

export const updateSale = async (saleId: number, sale: Record<string, any>): Promise<SaleProps> => {
  const response = await apiClient.put(`/ventas/${saleId}`, sale);
  return response.data;
};
