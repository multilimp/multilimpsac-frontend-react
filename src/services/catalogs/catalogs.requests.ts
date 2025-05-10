
import apiClient from '../apiClient';
import { CatalogProps } from './catalogs';

export const getCatalogs = async (): Promise<Array<CatalogProps>> => {
  const res = await apiClient.get('/catalogs');
  return res.data;
};

export const createCatalog = async (catalogData: Partial<CatalogProps>): Promise<CatalogProps> => {
  const res = await apiClient.post('/catalogs', catalogData);
  return res.data;
};

export const updateCatalog = async (catalogId: number, catalogData: Partial<CatalogProps>): Promise<CatalogProps> => {
  const res = await apiClient.put(`/catalogs/${catalogId}`, catalogData);
  return res.data;
};

export const deleteCatalog = async (catalogId: number): Promise<boolean> => {
  const res = await apiClient.delete(`/catalogs/${catalogId}`);
  return res.status === 200;
};

export const getCatalogsByCompany = async (companyId: number): Promise<Array<CatalogProps>> => {
  const res = await apiClient.get(`/catalogs/company/${companyId}`);
  return res.data;
};
