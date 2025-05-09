import { parseJSON } from '@/utils/functions';
import apiClient from '../apiClient';
import { SaleProps } from './sales';

export const getSales = async (): Promise<SaleProps[]> => {
  const response = await apiClient.get('/ventas');
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

export const createSale = async (sale: Record<string, any>): Promise<SaleProps> => {
  const response = await apiClient.post('/ventas', sale);
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
