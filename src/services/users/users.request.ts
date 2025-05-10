import apiClient from '../apiClient';
import { UserProps } from './users';

export const getUsers = async (): Promise<UserProps[]> => {
  const res = await apiClient.get('/users');
  return res.data;
};

export const postUser = async (data: Record<string, any>): Promise<boolean> => {
  const res = await apiClient.post('/users', data);
  return res.data;
};

export const putUser = async (userId: number, data: Record<string, any>): Promise<boolean> => {
  const res = await apiClient.put(`/users/${userId}`, data);
  return res.data;
};
