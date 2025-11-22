import { parseJSON } from '@/utils/functions';
import apiClient from '../apiClient';
import { SaleFiltersProps, SaleProcessedProps, SaleProps } from './sales';

export const getSales = async (params?: SaleFiltersProps): Promise<SaleProps[]> => {
  const response = await apiClient.get('/ventas', { params });
  const aux = response.data;
  const data = Array.isArray(aux) ? aux : [];

  const formatted = data.map((item) => ({
    ...item,
    departamentoEntrega: item.departamentoEntrega || null,
    provinciaEntrega: item.provinciaEntrega || null,
    distritoEntrega: item.distritoEntrega || null,
    productos: Array.isArray(item.productos) ? item.productos : parseJSON(item.productos) || [],
  }));

  return formatted;
};

export const getSaleById = async (id: number): Promise<SaleProps> => {
  const response = await apiClient.get(`/ventas/${id}`);
  const item = response.data;

  return {
    ...item,
    departamentoEntrega: item.departamentoEntrega || null,
    provinciaEntrega: item.provinciaEntrega || null,
    distritoEntrega: item.distritoEntrega || null,
    productos: Array.isArray(item.productos) ? item.productos : parseJSON(item.productos) || [],
    ordenesProveedor: item.ordenesProveedor || [],
  };
};

export const getPrivateSaleData = async (saleId: number): Promise<{
  tipoEntrega?: string;
  nombreAgencia?: string;
  destinoFinal?: string;
  nombreEntidad?: string;
  estadoPago?: string;
  notaPago?: string;
} | null> => {
  try {
    const sale = await getSaleById(saleId);

    if (!sale.ventaPrivada || !sale.ordenCompraPrivada) {
      return null;
    }

    return {
      tipoEntrega: sale.ordenCompraPrivada.tipoDestino || undefined,
      nombreAgencia: sale.ordenCompraPrivada.nombreAgencia || undefined,
      destinoFinal: sale.ordenCompraPrivada.destinoFinal || undefined,
      nombreEntidad: sale.ordenCompraPrivada.nombreEntidad || undefined,
      estadoPago: sale.ordenCompraPrivada.estadoPago || undefined,
      notaPago: sale.ordenCompraPrivada.notaPago || undefined,
    };
  } catch (error) {
    console.error('Error obteniendo datos de venta privada:', error);
    return null;
  }
};

export const createDirectSale = async (sale: Record<string, any>): Promise<SaleProps> => {
  const response = await apiClient.post('/ventas', sale);
  return response.data;
};

export const processPdfSales = async (file: File): Promise<SaleProcessedProps> => {
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

export const patchSale = async (saleId: number, data: Record<string, any>): Promise<SaleProps> => {
  const response = await apiClient.patch(`/ventas/${saleId}`, data);
  return response.data;
};
