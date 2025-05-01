import apiClient from '../apiClient';
import { CompanyProps } from './company';

export const getCompanies = async (): Promise<Array<CompanyProps>> => {
  const res = await apiClient.get('/companies');
  return res.data;
};

export const postCompany = () => {
  console.log('CREAR');
};
