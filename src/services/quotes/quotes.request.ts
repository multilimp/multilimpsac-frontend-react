import apiClient from '../apiClient';
import { QuoteProps } from './quotes';
import { OrderProps } from '../orders/orders';

export const getQuotes = async (): Promise<QuoteProps[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay de carga
  try {
    const response = await apiClient.get('/quotes');
    // Aseguramos que siempre devolvemos un array
    return Array.isArray(response?.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return []; // Devuelve array vacío en caso de error
  }
};

export const createQuote = async (quote: Omit<QuoteProps, 'id'>): Promise<QuoteProps> => {
  const response = await apiClient.post('/quotes', quote);
  return response.data;
};

export const approveQuote = async (id: string): Promise<QuoteProps> => {
  const response = await apiClient.patch(`/quotes/${id}/approve`);
  return response.data;
};

export const convertQuoteToOrder = async (quoteId: string): Promise<OrderProps> => {
  const response = await apiClient.post(`/quotes/${quoteId}/convert`);
  return response.data;
};