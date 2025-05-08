// src/services/trackings/trackings.request.ts
import apiClient from '../apiClient';
import { TrackingProps } from './trackings.d';

export const getTrackings = async (): Promise<TrackingProps[]> => {
  try {
    const res = await apiClient.get('/trackings');
    return Array.isArray(res.data) ? res.data : [];
  } catch (e) {
    console.error('Error fetching trackings:', e);
    return [];
  }
};

export const createTracking = async (
  payload: Omit<TrackingProps, 'id'>
): Promise<TrackingProps> => {
  const res = await apiClient.post('/trackings', payload);
  return res.data;
};

export const updateTracking = async (
  id: number,
  payload: Partial<TrackingProps>
): Promise<TrackingProps> => {
  const res = await apiClient.patch(`/trackings/${id}`, payload);
  return res.data;
};

export const deleteTracking = async (id: number): Promise<void> => {
  await apiClient.delete(`/trackings/${id}`);
};
