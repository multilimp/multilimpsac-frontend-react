import apiClient from '../apiClient';
import { UserProps } from './user';

export const authUser = async (body: Record<string, string>): Promise<{ token: string; user: UserProps }> => {
  const res = await apiClient.post('/auth/login', body);
  return res.data;
};

export const validateSession = async (): Promise<UserProps> => {
  const res = await apiClient.get('/auth/validate-token');
  return res.data.user;
};
