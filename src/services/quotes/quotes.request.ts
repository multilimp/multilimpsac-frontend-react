import apiClient from '../apiClient';
import { QuoteProps } from './quotes';

export const getQuotes = async (): Promise<QuoteProps[]> => {
  const response = await apiClient.get('/quotes');
  return response.data;
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