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
  // Relaciones
  usuario?: {
    id: number;
    nombre: string;
    email: string;
  };
}

export interface CobranzaData {
  etapaSiaf?: string;
  fechaSiaf?: string;
  penalidad?: string;
  estadoCobranza?: string;
  fechaEstadoCobranza?: string;
}

/**
 * CAMPOS DE COBRANZA - Nuevos endpoints específicos para campos de cobranza
 */

/**
 * Actualiza los campos específicos de cobranza (PATCH)
 */
export const updateCobranzaFields = async (ordenCompraId: number, data: CobranzaData): Promise<void> => {
  try {
    const response = await apiClient.patch(`/orden-compra/${ordenCompraId}/cobranza`, data);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar campos de cobranza:', error);
    throw new Error('No se pudieron actualizar los campos de cobranza');
  }
};

/**
 * Obtiene los datos de cobranza de una orden de compra
 */
export const getCobranzaByOrdenCompra = async (ordenCompraId: number): Promise<CobranzaData> => {
  try {
    const response = await apiClient.get(`/orden-compra/${ordenCompraId}/cobranza`);
    const cobranza = response.data.data;
    
    return {
      etapaSiaf: cobranza.etapaSiaf,
      fechaSiaf: cobranza.fechaSiaf,
      penalidad: cobranza.penalidad,
      estadoCobranza: cobranza.estadoCobranza,
      fechaEstadoCobranza: cobranza.fechaEstadoCobranza,
    };
  } catch (error) {
    console.error('Error al obtener datos de cobranza:', error);
    throw new Error('No se pudieron cargar los datos de cobranza');
  }
};

/**
 * GESTIONES DE COBRANZA - CRUD clásico para gestiones
 */

/**
 * Obtiene las gestiones de cobranza para una orden de compra específica
 */
export const getGestionesCobranza = async (ordenCompraId: number): Promise<GestionCobranza[]> => {
  try {
    const response = await apiClient.get(`/gestiones-cobranza/orden-compra/${ordenCompraId}`);
    return response.data.data || response.data || [];
  } catch (error) {
    console.error('Error al obtener gestiones de cobranza:', error);
    throw new Error('No se pudieron cargar las gestiones de cobranza');
  }
};

/**
 * Crea una nueva gestión de cobranza
 */
export const createGestionCobranza = async (gestion: Omit<GestionCobranza, 'id' | 'createdAt' | 'updatedAt'>): Promise<GestionCobranza> => {
  try {
    const response = await apiClient.post(`/gestiones-cobranza`, gestion);
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
    const response = await apiClient.put(`/gestiones-cobranza/${gestionId}`, gestion);
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
    await apiClient.delete(`/gestiones-cobranza/${gestionId}`);
  } catch (error) {
    console.error('Error al eliminar gestión de cobranza:', error);
    throw new Error('No se pudo eliminar la gestión de cobranza');
  }
};

/**
 * MÉTODOS LEGACY - Mantener compatibilidad con código existente
 */

/**
 * @deprecated Usar updateCobranzaFields en su lugar
 */
export const updateCobranza = async (ordenCompraId: number, data: CobranzaData): Promise<void> => {
  return updateCobranzaFields(ordenCompraId, data);
};
