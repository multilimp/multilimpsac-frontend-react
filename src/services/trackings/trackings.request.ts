import apiClient from '../apiClient';
import { TrackingProps } from './trackings.d';

export const getTrackings = async (): Promise<Array<TrackingProps>> => {
  try {
    const response = await apiClient.get('/trackings');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching trackings:', error);
    return [];
  }
};

export const createTracking = async (trackingData: Omit<TrackingProps, 'id'>): Promise<TrackingProps> => {
  try {
    const response = await apiClient.post('/trackings', trackingData);
    return response.data;
  } catch (error) {
    console.error('Error creating tracking:', error);
    throw error;
  }
};

export const updateTracking = async (id: number, trackingData: Partial<TrackingProps>): Promise<TrackingProps> => {
  try {
    const response = await apiClient.patch(`/trackings/${id}`, trackingData);
    return response.data;
  } catch (error) {
    console.error('Error updating tracking:', error);
    throw error;
  }
};

export const deleteTracking = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/trackings/${id}`);
  } catch (error) {
    console.error('Error deleting tracking:', error);
    throw error;
  }
};