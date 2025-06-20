// src/services/trackings/trackings.request.ts

import apiClient from '../apiClient';
import { TrackingProps } from './trackings.d';

// ——— Servicios reales conectados al backend ———
export const getTrackings = async (): Promise<TrackingProps[]> => {
  try {
    // Obtenemos las órdenes de compra para crear el tracking
    const response = await apiClient.get('/ordenes-compra');
    const ordenesCompra = response.data;
    
    // Transformamos las OCs en datos de tracking
    const trackings: TrackingProps[] = ordenesCompra.map((oc: any) => ({
      id: oc.id,
      saleId: oc.id,
      clientRuc: oc.cliente?.ruc || '',
      companyRuc: oc.empresa?.ruc || '',
      companyBusinessName: oc.empresa?.razonSocial || '',
      clientName: oc.cliente?.razonSocial || '',
      maxDeliveryDate: oc.fechaMaxForm || new Date().toISOString(),
      saleAmount: parseFloat(oc.montoVenta || '0'),
      cue: oc.cliente?.codigoUnidadEjecutora || '',
      department: oc.departamentoEntrega || '',
      oce: oc.documentoOce || undefined,
      ocf: oc.documentoOcf || undefined,
      peruPurchases: false, // Campo calculado o predeterminado
      grr: undefined, // Campo pendiente de implementar
      invoiceNumber: undefined, // Campo pendiente de implementar
      isRefact: false, // Campo calculado o predeterminado
      peruPurchasesDate: undefined, // Campo pendiente de implementar
      deliveryDateOC: undefined, // Campo pendiente de implementar
      utility: 0, // Campo calculado o predeterminado
      status: 'pending' as const, // Estado inicial
      createdAt: oc.createdAt || oc.fechaEmision || new Date().toISOString(), // Fecha de creación para ordenamiento
    }));
    
    // Ordenar por fecha de creación descendente (más recientes primero)
    const sortedTrackings = trackings.sort((a, b) => {
      const dateA = new Date(a.createdAt || '').getTime();
      const dateB = new Date(b.createdAt || '').getTime();
      return dateB - dateA; // Orden descendente
    });
    
    return sortedTrackings;
  } catch (error) {
    console.error('Error al obtener trackings:', error);
    return [];
  }
};

export const createTracking = async (
  payload: Omit<TrackingProps, 'id'>
): Promise<TrackingProps> => {
  try {
    // Por ahora retornamos un mock hasta implementar endpoint de creación
    const newTracking: TrackingProps = { 
      id: Date.now(), // ID temporal
      ...payload 
    };
    return newTracking;
  } catch (error) {
    console.error('Error al crear tracking:', error);
    throw error;
  }
};

export const updateTracking = async (
  id: number,
  payload: Partial<TrackingProps>
): Promise<TrackingProps> => {
  try {
    // Por ahora retornamos un mock hasta implementar endpoint de actualización
    const updatedTracking: TrackingProps = { 
      ...payload as TrackingProps,
      id // Aseguramos que el ID se mantenga
    };
    return updatedTracking;
  } catch (error) {
    console.error('Error al actualizar tracking:', error);
    throw error;
  }
};

export const deleteTracking = async (id: number): Promise<void> => {
  try {
    // Por ahora solo loggeamos hasta implementar endpoint de eliminación
    console.log('Eliminando tracking:', id);
  } catch (error) {
    console.error('Error al eliminar tracking:', error);
    throw error;
  }
};

// Servicios específicos para TrackingsOrdersPage
export const getOrdenCompraByTrackingId = async (trackingId: number) => {
  try {
    const response = await apiClient.get(`/ordenes-compra/${trackingId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener orden de compra:', error);
    throw error;
  }
};

export const getOpsByOrdenCompra = async (ordenCompraId: number) => {
  try {
    const response = await apiClient.get(`/ordenes-proveedores/${ordenCompraId}/op`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener órdenes de proveedor:', error);
    throw error;
  }
};
