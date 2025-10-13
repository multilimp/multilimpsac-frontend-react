// src/services/treasury/treasury.request.ts

import apiClient from '../apiClient';

// Servicios para módulo de Tesorería
export const getTreasuryTrackings = async () => {
  try {
    const response = await apiClient.get('/ordenes-compra');
    const ordenesCompra = response.data;

    // Transformamos las OCs en datos de tesorería
    const treasuryData = ordenesCompra.map((oc: any) => ({
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
      // Campos específicos de tesorería
      estadoPago: oc.estadoPago || 'Pendiente',
      fechaPago: oc.fechaPago || null,
      metodoPago: oc.metodoPago || '',
      numeroTransaccion: oc.numeroTransaccion || '',
    }));

    return treasuryData;
  } catch (error) {
    console.error('Error al obtener datos de tesorería:', error);
    throw error;
  }
};

export const getOrdenCompraByTreasuryId = async (treasuryId: number) => {
  try {
    const response = await apiClient.get(`/ordenes-compra/${treasuryId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener orden de compra para tesorería:', error);
    throw error;
  }
};

export const getOpsByOrdenCompraForTreasury = async (ordenCompraId: number) => {
  try {
    const response = await apiClient.get(`/ordenes-proveedores/${ordenCompraId}/op`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener órdenes de proveedor para tesorería:', error);
    throw error;
  }
};

export const updateTreasuryPayment = async (ordenCompraId: number, paymentData: any) => {
  try {
    const response = await apiClient.put(`/tesoreria/${ordenCompraId}`, paymentData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar pago de tesorería:', error);
    throw error;
  }
};

// Funciones para dashboard de tesorería
export const getPagosUrgentes = async () => {
  try {
    const response = await apiClient.get('/tesoreria/pagos-urgentes');
    return response.data;
  } catch (error) {
    console.error('Error al obtener pagos urgentes:', error);
    throw error;
  }
};

export const getPagosPendientes = async () => {
  try {
    const response = await apiClient.get('/tesoreria/pagos-pendientes');
    return response.data;
  } catch (error) {
    console.error('Error al obtener pagos pendientes:', error);
    throw error;
  }
};

