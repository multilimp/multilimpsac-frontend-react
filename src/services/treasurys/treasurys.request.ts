import apiClient from '../apiClient';
import { TreasurysProps } from './treasurys.d';

export const getTreasurys = async (): Promise<Array<TreasurysProps>> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const response = await apiClient.get('/treasurys');
    return response.data;
  } catch (error) {
    console.error('Error fetching treasurys:', error);
    throw error;
  }
};

export const createTreasury = async (treasuryData: Omit<TreasurysProps, 'id'>): Promise<TreasurysProps> => {
  try {
    const response = await apiClient.post('/treasurys', treasuryData);
    return response.data;
  } catch (error) {
    console.error('Error creating treasury:', error);
    throw error;
  }
};

export const updateTreasury = async (id: number, treasuryData: Partial<TreasurysProps>): Promise<TreasurysProps> => {
  try {
    const response = await apiClient.patch(`/treasurys/${id}`, treasuryData);
    return response.data;
  } catch (error) {
    console.error('Error updating treasury:', error);
    throw error;
  }
};

export const deleteTreasury = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/treasurys/${id}`);
  } catch (error) {
    console.error('Error deleting treasury:', error);
    throw error;
  }
};