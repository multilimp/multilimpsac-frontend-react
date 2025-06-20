// src/services/billing/billing.request.ts

import apiClient from '../apiClient';

// Servicios para módulo de Facturación
export const getBillingTrackings = async () => {
  try {
    const response = await apiClient.get('/ordenes-compra');
    const ordenesCompra = response.data;
    
    // Transformamos las OCs en datos de facturación
    const billingData = ordenesCompra.map((oc: any) => ({
      id: oc.id,
      saleId: oc.id,
      codigo: oc.codigoVenta,
      clientRuc: oc.cliente?.ruc || '',
      companyRuc: oc.empresa?.ruc || '',
      companyBusinessName: oc.empresa?.razonSocial || '',
      clientName: oc.cliente?.razonSocial || '',
      maxDeliveryDate: oc.fechaMaxForm || new Date().toISOString(),
      saleAmount: parseFloat(oc.montoVenta || '0'),
      cue: oc.cliente?.codigoUnidadEjecutora || '',
      department: oc.departamentoEntrega || '',
      // Campos específicos de facturación
      numeroFactura: oc.numeroFactura || '',
      fechaFactura: oc.fechaFactura || null,
      estadoFactura: oc.estadoFactura || 'Por Facturar',
      montoFacturado: parseFloat(oc.montoFacturado || '0'),
      documentoFactura: oc.documentoFactura || null,
    }));
    
    return billingData;
  } catch (error) {
    console.error('Error al obtener datos de facturación:', error);
    throw error;
  }
};

export const getOrdenCompraByBillingId = async (billingId: number) => {
  try {
    const response = await apiClient.get(`/ordenes-compra/${billingId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener orden de compra para facturación:', error);
    throw error;
  }
};

export const getOpsByOrdenCompraForBilling = async (ordenCompraId: number) => {
  try {
    const response = await apiClient.get(`/ordenes-proveedores/${ordenCompraId}/op`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener órdenes de proveedor para facturación:', error);
    throw error;
  }
};

export const updateBillingInfo = async (ordenCompraId: number, billingData: any) => {
  try {
    const response = await apiClient.put(`/facturacion/${ordenCompraId}`, billingData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar información de facturación:', error);
    throw error;
  }
};

export const generateInvoice = async (ordenCompraId: number, invoiceData: any) => {
  try {
    const response = await apiClient.post(`/facturacion/${ordenCompraId}/generar`, invoiceData);
    return response.data;
  } catch (error) {
    console.error('Error al generar factura:', error);
    throw error;
  }
};
