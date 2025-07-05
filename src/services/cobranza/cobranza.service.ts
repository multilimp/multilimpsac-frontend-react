// src/services/cobranza/cobranza.service.ts
import apiClient from '../apiClient';

export interface GestionCobranza {
  id?: number;
  ordenCompraId: number;
  fechaGestion: string;
  notaGestion: string;
  estadoCobranza: string;
  tipoCobranza: string;
  voucherPagoUrl?: string;
  pagoConformeTesoreria?: boolean;
  cartaAmpliacionUrl?: string;
  capturaEnvioDocumentoUrl?: string;
  archivosAdjuntosNotasGestion?: string;
  documentosRegistrados?: string;
  notaEspecialEntrega?: string;
  usuarioId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CobranzaData {
  etapaSiaf?: string;
  fechaSiaf?: string;
  retencion?: string;
  detraccion?: string;
  penalidad?: string;
  netoCobrado?: string;
  estadoCobranza?: string;
  fechaEstadoCobranza?: string;
  fechaProximaGestion?: string;
}

/**
 * Obtiene las gestiones de cobranza para una orden de compra específica
 */
export const getGestionesCobranza = async (ordenCompraId: number): Promise<GestionCobranza[]> => {
  try {
    const response = await apiClient.get(`/orden-compra/${ordenCompraId}/cobranzas`);
    return response.data.data || response.data || [];
  } catch (error) {
    console.error('Error al obtener gestiones de cobranza:', error);
    throw new Error('No se pudieron cargar las gestiones de cobranza');
  }
};

/**
 * Actualiza la información de cobranza de una orden de compra
 */
export const updateCobranza = async (ordenCompraId: number, data: CobranzaData): Promise<void> => {
  try {
    const response = await apiClient.post(`/orden-compra/${ordenCompraId}/cobranzas`, data);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar cobranza:', error);
    throw new Error('No se pudo actualizar la información de cobranza');
  }
};

/**
 * Crea una nueva gestión de cobranza
 */
export const createGestionCobranza = async (gestion: Omit<GestionCobranza, 'id' | 'createdAt' | 'updatedAt'>): Promise<GestionCobranza> => {
  try {
    const response = await apiClient.post(`/orden-compra/${gestion.ordenCompraId}/cobranzas/gestion`, gestion);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error al crear gestión de cobranza:', error);
    throw new Error('No se pudo crear la gestión de cobranza');
  }
};

/**
 * Actualiza una gestión de cobranza existente
 */
export const updateGestionCobranza = async (gestionId: number, gestion: Partial<GestionCobranza>): Promise<GestionCobranza> => {
  try {
    const response = await apiClient.put(`/gestion-cobranza/${gestionId}`, gestion);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error al actualizar gestión de cobranza:', error);
    throw new Error('No se pudo actualizar la gestión de cobranza');
  }
};

/**
 * Elimina una gestión de cobranza
 */
export const deleteGestionCobranza = async (gestionId: number): Promise<void> => {
  try {
    await apiClient.delete(`/gestion-cobranza/${gestionId}`);
  } catch (error) {
    console.error('Error al eliminar gestión de cobranza:', error);
    throw new Error('No se pudo eliminar la gestión de cobranza');
  }
};

/**
 * Obtiene los datos de cobranza de una orden de compra
 */
export const getCobranzaByOrdenCompra = async (ordenCompraId: number): Promise<CobranzaData> => {
  try {
    const response = await apiClient.get(`/ventas/${ordenCompraId}`);
    const sale = response.data;
    
    return {
      etapaSiaf: sale.etapaSiaf,
      fechaSiaf: sale.fechaSiaf,
      retencion: sale.retencion,
      detraccion: sale.detraccion,
      penalidad: sale.penalidad,
      netoCobrado: sale.netoCobrado,
      estadoCobranza: sale.estadoCobranza,
      fechaEstadoCobranza: sale.fechaEstadoCobranza,
      fechaProximaGestion: sale.fechaProximaGestion,
    };
  } catch (error) {
    console.error('Error al obtener datos de cobranza:', error);
    throw new Error('No se pudieron cargar los datos de cobranza');
  }
};
