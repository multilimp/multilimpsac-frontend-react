// src/services/billings/billings.requests.ts
import apiClient from '../apiClient';
import { BillingProps } from './billings.d';

export const getBillings = async (): Promise<BillingProps[]> => {
  try {
    // Obtenemos las órdenes de compra para crear la data de facturación
    const response = await apiClient.get('/ordenes-compra');
    const ordenesCompra = response.data;
    
    // Transformamos las OCs en datos de facturación
    const billings: BillingProps[] = ordenesCompra.map((oc: any) => ({
      id: oc.id,
      saleId: oc.id,
      clientBusinessName: oc.cliente?.razonSocial || '',
      clientRuc: oc.cliente?.ruc || '',
      companyRuc: oc.empresa?.ruc || '',
      companyBusinessName: oc.empresa?.razonSocial || '',
      contact: oc.contactoCliente?.nombre || '',
      registerDate: oc.fechaEmision || new Date().toISOString(),
      maxDeliveryDate: oc.fechaMaxForm || new Date().toISOString(),
      deliveryDateOC: oc.fechaEntrega || undefined,
      saleAmount: parseFloat(oc.montoVenta || '0'),
      oce: oc.documentoOce || '',
      ocf: oc.documentoOcf || '',
      receptionDate: oc.fechaEntrega || new Date().toISOString(),
      programmingDate: oc.fechaMaxForm || new Date().toISOString(),
      invoiceNumber: undefined, // Campo pendiente de implementar
      invoiceDate: undefined, // Campo pendiente de implementar
      grr: undefined, // Campo pendiente de implementar
      isRefact: false, // Campo calculado o predeterminado
      status: oc.estadoActivo ? 'pending' : 'processed',
    }));
    
    return billings;
  } catch (error) {
    console.error('Error al obtener billings:', error);
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
