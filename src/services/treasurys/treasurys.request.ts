// src/services/treasurys/treasurys.requests.ts
import apiClient from '../apiClient';
import { TreasurysProps } from './treasurys.d';

export const getTreasurys = async (): Promise<TreasurysProps[]> => {
  const res = await apiClient.get('/treasurys');
  return res.data;
};

export const createTreasury = async (
  payload: Omit<TreasurysProps, 'id'>
): Promise<TreasurysProps> => {
  const res = await apiClient.post('/treasurys', payload);
  return res.data;
};

export const updateTreasury = async (
  id: number,
  payload: Partial<Omit<TreasurysProps, 'id'>>
): Promise<TreasurysProps> => {
  const res = await apiClient.patch(`/treasurys/${id}`, payload);
  return res.data;
};

export const deleteTreasury = async (id: number): Promise<void> => {
  await apiClient.delete(`/treasurys/${id}`);
};
