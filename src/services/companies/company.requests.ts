import apiClient from '../apiClient';
import { CompanyProps } from './company';

export const getCompanies = async (): Promise<Array<CompanyProps>> => {
  const res = await apiClient.get('/companies');
  return res.data;
};

export const postCompany = async (data: Record<string, string | File>): Promise<boolean> => {
  const res = await apiClient.post('/companies', data);
  return res.data;
};

export const putCompany = async (companyId: number, data: Record<string, string | File>): Promise<boolean> => {
  const res = await apiClient.put(`/companies/${companyId}`, data);
  return res.data;
};
