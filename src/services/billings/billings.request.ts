import apiClient from '../apiClient';
import { BillingProps } from './billings.d';

export const getBillings = async (): Promise<Array<BillingProps>> => {
  try {
    const response = await apiClient.get('/billings');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching billings:', error);
    return [];
  }
};

export const createBilling = async (billingData: Omit<BillingProps, 'id'>): Promise<BillingProps> => {
  try {
    const response = await apiClient.post('/billings', billingData);
    return response.data;
  } catch (error) {
    console.error('Error creating billing:', error);
    throw error;
  }
};

export const updateBilling = async (id: number, billingData: Partial<BillingProps>): Promise<BillingProps> => {
  try {
    const response = await apiClient.patch(`/billings/${id}`, billingData);
    return response.data;
  } catch (error) {
    console.error('Error updating billing:', error);
    throw error;
  }
};

export const deleteBilling = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/billings/${id}`);
  } catch (error) {
    console.error('Error deleting billing:', error);
    throw error;
  }
};