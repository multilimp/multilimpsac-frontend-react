import apiClient from '../apiClient';
import { CatalogProps } from './catalogs';

export const getCatalogs = async (): Promise<Array<CatalogProps>> => {
  const res = await apiClient.get('/catalogs');
  return res.data;
};
