import apiClient from '../apiClient';
import { QuoteProps } from './quotes';

export const getQuotes = async (): Promise<QuoteProps[]> => {
  const res = await apiClient.get('/quotes');
  return Array.isArray(res.data) ? res.data : [];
};

export const createQuote = async (quote: Omit<QuoteProps, 'id'>): Promise<QuoteProps> => {
  const res = await apiClient.post('/quotes', quote);
  return res.data;
};

export const updateQuote = async (id: string | number, quote: Omit<QuoteProps, 'id'>): Promise<QuoteProps> => {
  const res = await apiClient.put(`/quotes/${id}`, quote);
  return res.data;
};
