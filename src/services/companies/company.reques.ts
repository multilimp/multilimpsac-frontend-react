import apiClient from '../apiClient';
import { CompanyProps } from './company';

export const getCompanies = async (): Promise<Array<CompanyProps>> => {
  await new Promise((resolve) => setTimeout(resolve, 2500));
  const res = await apiClient.get('/companies');
  return res.data;
};

export const postCompany = () => {
  console.log('CREAR');
};
