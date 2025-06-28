// src/services/treasurys/treasurys.requests.ts
import apiClient from '../apiClient';
import { TreasurysProps } from './treasurys.d';

export const getTreasurys = async (): Promise<TreasurysProps[]> => {
  try {
    // Obtenemos las órdenes de compra para crear la data de tesorería
    const response = await apiClient.get('/ordenes-compra');
    const ordenesCompra = response.data;
    
    // Transformamos las OCs en datos de tesorería
    const treasurys: TreasurysProps[] = ordenesCompra.map((oc: any) => ({
      id: oc.id,
      saleCode: oc.codigoVenta || `OC-${oc.id}`,
      clientBusinessName: oc.cliente?.razonSocial || '',
      clientRuc: oc.cliente?.ruc || '',
      companyRuc: oc.empresa?.ruc || '',
      companyBusinessName: oc.empresa?.razonSocial || '',
      contact: oc.contactoCliente?.nombre || '',
      status: oc.estadoActivo ? 'pending' : 'processed',
    }));
    
    return treasurys;
  } catch (error) {
    console.error('Error al obtener treasurys:', error);
    return [];
  }
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

export const getOrdenCompraByTreasuryId = async (treasuryId: number) => {
  try {
    // Obtenemos la orden de compra específica por ID
    const response = await apiClient.get(`/ordenes-compra/${treasuryId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener orden de compra para tesorería:', error);
    throw error;
  }
};

export const getOpsByOrdenCompra = async (ordenCompraId: number) => {
  try {
    // Obtenemos las órdenes de proveedor relacionadas a la orden de compra
    const response = await apiClient.get(`/ordenes-proveedores/${ordenCompraId}/op`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener órdenes de proveedor:', error);
    return [];
  }
};

// ✅ NUEVO: Servicios para gestión de pagos de transporte desde tesorería
export const getTransportesByOrdenCompraForTesoreria = async (ordenCompraId: number) => {
  try {
    const response = await apiClient.get(`/tesoreria/transportes/orden-compra/${ordenCompraId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener transportes para tesorería:', error);
    return [];
  }
};

export const getTransporteAsignadoForTesoreria = async (transporteAsignadoId: number) => {
  try {
    const response = await apiClient.get(`/tesoreria/transporte/${transporteAsignadoId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener transporte asignado para tesorería:', error);
    throw error;
  }
};

export const updatePagoTransporteFromTesoreria = async (transporteAsignadoId: number, paymentData: any) => {
  try {
    const response = await apiClient.post('/tesoreria/transporte', {
      transporteAsignadoId,
      pagos: paymentData.pagos,
      updatesForTransporteAsignado: paymentData.updatesForTransporteAsignado
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar pago de transporte desde tesorería:', error);
    throw error;
  }
};
