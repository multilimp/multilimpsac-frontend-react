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

export const updateProfile = async (userId: number, profileData: Partial<UserProps>): Promise<UserProps> => {
  const res = await apiClient.put(`/users/${userId}/profile`, profileData);
  return res.data;
};

export const uploadProfilePhoto = async (userId: number, photoFile: File): Promise<{ photoUrl: string; user: UserProps }> => {
  const formData = new FormData();
  formData.append('photo', photoFile);
  
  const res = await apiClient.post(`/upload/profile/${userId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const changePassword = async (userId: number, passwordData: { currentPassword: string; newPassword: string }): Promise<boolean> => {
  const res = await apiClient.put(`/users/${userId}/password`, passwordData);
  return res.data;
};
