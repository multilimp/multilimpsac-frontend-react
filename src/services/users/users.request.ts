import apiClient from '../apiClient';
import { UserProps } from './users.d';
import { uploadFile } from '../files/file.requests';

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

export const putUserWithImage = async (
  userId: number,
  data: Record<string, any>,
  imageFile?: File
): Promise<UserProps> => {
  const formData = new FormData();

  // Agregar todos los campos de datos al FormData
  Object.keys(data).forEach(key => {
    if (data[key] !== undefined && data[key] !== null) {
      if (key === 'permisos' && Array.isArray(data[key])) {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, String(data[key]));
      }
    }
  });

  // Agregar imagen si existe
  if (imageFile) {
    formData.append('foto', imageFile);
  }

  const res = await apiClient.put(`/users/${userId}/with-image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const updateProfile = async (userId: number, profileData: Partial<UserProps>): Promise<UserProps> => {
  const res = await apiClient.put(`/users/${userId}/profile`, profileData);
  return res.data;
};

export const uploadProfilePhoto = async (userId: number, photoFile: File): Promise<{ user: UserProps }> => {
  // Primero subir la imagen y obtener la URL
  const photoUrl = await uploadFile(photoFile);

  // Luego actualizar el perfil del usuario con la URL de la foto
  const updatedUser = await updateProfile(userId, { foto: photoUrl });

  return { user: updatedUser };
};

export const changePassword = async (userId: number, passwordData: { currentPassword: string; newPassword: string }): Promise<boolean> => {
  const res = await apiClient.put(`/users/${userId}/password`, passwordData);
  return res.data;
};

export const adminChangePassword = async (userId: number, newPassword: string): Promise<boolean> => {
  const res = await apiClient.put(`/users/${userId}/admin-change-password`, { newPassword });
  return res.data;
};
