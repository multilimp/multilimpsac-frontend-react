import apiClient from '../apiClient';
import { ContactProps } from './contacts';

export const getContacts = async (): Promise<Array<ContactProps>> => {
  const res = await apiClient.get('/contacts');
  return res.data;
};
