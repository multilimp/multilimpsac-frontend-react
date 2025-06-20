// src/services/collections/collections.request.ts
import apiClient from '../apiClient';
import { CollectionProps } from './collections.d';

export const getCollections = async (): Promise<CollectionProps[]> => {
  try {
    // Obtenemos las órdenes de compra desde el endpoint de ventas (mismo backend)
    const response = await apiClient.get('/ordenes-compra');
    const ordenesCompra = response.data;
    
    // Transformamos las OCs manteniendo la estructura exacta de ventas
    const collections: CollectionProps[] = ordenesCompra.map((oc: any) => ({
      id: oc.id,
      codigoVenta: oc.codigoVenta,
      cliente: {
        razonSocial: oc.cliente?.razonSocial || '',
        ruc: oc.cliente?.ruc || '',
        codigoUnidadEjecutora: oc.cliente?.codigoUnidadEjecutora || '',
      },
      empresa: {
        ruc: oc.empresa?.ruc || '',
        razonSocial: oc.empresa?.razonSocial || '',
      },
      contactoCliente: oc.contactoCliente ? {
        nombre: oc.contactoCliente.nombre,
        cargo: oc.contactoCliente.cargo,
      } : undefined,
      catalogoEmpresa: oc.catalogoEmpresa ? {
        nombre: oc.catalogoEmpresa.nombre,
      } : undefined,
      fechaForm: oc.fechaForm || oc.fechaEmision || new Date().toISOString(),
      fechaMaxForm: oc.fechaMaxForm || oc.fechaMaxEntrega || new Date().toISOString(),
      montoVenta: oc.montoVenta || '0',
      direccionEntrega: oc.direccionEntrega,
      departamentoEntrega: oc.departamentoEntrega,
      provinciaEntrega: oc.provinciaEntrega,
      distritoEntrega: oc.distritoEntrega,
      referenciaEntrega: oc.referenciaEntrega,
      estadoVenta: oc.estadoVenta || 'incompleto',
      documentoOce: oc.documentoOce,
      documentoOcf: oc.documentoOcf,
      // Campos específicos de cobranza
      estadoCobranza: oc.estadoCobranza,
      fechaEstadoCobranza: oc.fechaEstadoCobranza,
      netoCobrado: oc.netoCobrado,
      penalidad: oc.penalidad,
      fechaProximaGestion: oc.fechaProximaGestion,
    }));
    
    // Ordenar por fecha de creación descendente (más recientes primero)
    const sortedCollections = collections.sort((a, b) => {
      const dateA = new Date(a.fechaForm || '').getTime();
      const dateB = new Date(b.fechaForm || '').getTime();
      return dateB - dateA; // Orden descendente
    });
    
    return sortedCollections;
  } catch (error) {
    console.error('Error al obtener collections:', error);
    return [];
  }
};
export const createCollection = async (
  payload: Omit<CollectionProps, 'id'>
): Promise<CollectionProps> => {
  try {
    // Por ahora retornamos un mock hasta implementar endpoint de creación
    const newCollection: CollectionProps = { 
      id: Date.now(), // ID temporal
      ...payload 
    };
    return newCollection;
  } catch (error) {
    console.error('Error al crear collection:', error);
    throw error;
  }
};

export const updateCollection = async (
  id: number,
  payload: Partial<CollectionProps>
): Promise<CollectionProps> => {
  try {
    // Por ahora retornamos un mock hasta implementar endpoint de actualización
    const updatedCollection: CollectionProps = { 
      ...payload as CollectionProps,
      id // Aseguramos que el ID se mantenga
    };
    return updatedCollection;
  } catch (error) {
    console.error('Error al actualizar collection:', error);
    throw error;
  }
};

export const deleteCollection = async (id: number): Promise<void> => {
  try {
    // Por ahora solo loggeamos hasta implementar endpoint de eliminación
    console.log('Eliminando collection:', id);
  } catch (error) {
    console.error('Error al eliminar collection:', error);
    throw error;
  }
};
