import apiClient from '../apiClient';

export const uploadFile = async (file: File): Promise<string> => {
  const form = new FormData();
  form.append('file', file);

  const res = await apiClient.post('/files', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  const fileUrl = res.data.url;
  if (!fileUrl) throw new Error('NOT FOUND FILE');

  return fileUrl;
};
