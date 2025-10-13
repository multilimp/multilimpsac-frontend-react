// src/services/collection/collection.request.ts

import apiClient from '../apiClient';

// Servicios para módulo de Cobranzas
export const getCollectionTrackings = async () => {
  try {
    const response = await apiClient.get('/ordenes-compra');
    const ordenesCompra = response.data;
    
    // Transformamos las OCs en datos de cobranza
    const collectionData = ordenesCompra.map((oc: any) => ({
      id: oc.id,
      saleId: oc.id,
      codigo: oc.codigoVenta,
      clientRuc: oc.cliente?.ruc || '',
      companyRuc: oc.empresa?.ruc || '',
      companyBusinessName: oc.empresa?.razonSocial || '',
      clientName: oc.cliente?.razonSocial || '',
      maxDeliveryDate: oc.fechaMaxForm || null,
      saleAmount: parseFloat(oc.montoVenta || '0'),
      cue: oc.cliente?.codigoUnidadEjecutora || '',
      department: oc.departamentoEntrega || '',
      // Campos específicos de cobranza
      estadoCobranza: oc.estadoCobranza || 'Pendiente',
      fechaCobranza: oc.fechaCobranza || null,
      montoRecaudado: parseFloat(oc.montoRecaudado || '0'),
      saldoPendiente: parseFloat(oc.montoVenta || '0') - parseFloat(oc.montoRecaudado || '0'),
      metodoCobro: oc.metodoCobro || '',
      numeroRecibo: oc.numeroRecibo || '',
      documentoCobranza: oc.documentoCobranza || null,
    }));
    
    return collectionData;
  } catch (error) {
    console.error('Error al obtener datos de cobranza:', error);
    throw error;
  }
};

export const getOrdenCompraByCollectionId = async (collectionId: number) => {
  try {
    const response = await apiClient.get(`/ordenes-compra/${collectionId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener orden de compra para cobranza:', error);
    throw error;
  }
};

export const getOpsByOrdenCompraForCollection = async (ordenCompraId: number) => {
  try {
    const response = await apiClient.get(`/ordenes-proveedores/${ordenCompraId}/op`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener órdenes de proveedor para cobranza:', error);
    throw error;
  }
};

export const updateCollectionInfo = async (ordenCompraId: number, collectionData: any) => {
  try {
    const response = await apiClient.put(`/cobranza/${ordenCompraId}`, collectionData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar información de cobranza:', error);
    throw error;
  }
};

export const registerPayment = async (ordenCompraId: number, paymentData: any) => {
  try {
    const response = await apiClient.post(`/cobranza/${ordenCompraId}/pago`, paymentData);
    return response.data;
  } catch (error) {
    console.error('Error al registrar pago de cobranza:', error);
    throw error;
  }
};
