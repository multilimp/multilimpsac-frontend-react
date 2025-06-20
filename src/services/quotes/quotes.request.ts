import apiClient from '../apiClient';
import { CotizacionProps, CreateCotizacionData, UpdateCotizacionData } from '@/types/cotizacion.types';

export const getCotizaciones = async (): Promise<CotizacionProps[]> => {
  const res = await apiClient.get('/cotizaciones');
  return Array.isArray(res.data) ? res.data : [];
};

export const getCotizacionById = async (id: number): Promise<CotizacionProps> => {
  const res = await apiClient.get(`/cotizaciones/${id}`);
  return res.data;
};

export const createCotizacion = async (cotizacion: CreateCotizacionData): Promise<CotizacionProps> => {
  const res = await apiClient.post('/cotizaciones', cotizacion);
  return res.data;
};

export const updateCotizacion = async (id: number, cotizacion: UpdateCotizacionData): Promise<CotizacionProps> => {
  const res = await apiClient.put(`/cotizaciones/${id}`, cotizacion);
  return res.data;
};

export const deleteCotizacion = async (id: number): Promise<void> => {
  await apiClient.delete(`/cotizaciones/${id}`);
};

// Alias para compatibilidad con componentes existentes
export const createQuote = createCotizacion;
export const updateQuote = updateCotizacion;
export const getQuotes = getCotizaciones;
export const getQuoteById = getCotizacionById;
export const deleteQuote = deleteCotizacion;
