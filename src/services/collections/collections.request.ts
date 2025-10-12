// src/services/collections/collections.request.ts
import apiClient from '../apiClient';
import { CollectionProps } from './collections.d';

interface OrdenCompraMinimal {
  id: number;
  codigoVenta?: string;
  cliente?: { razonSocial?: string; ruc?: string; codigoUnidadEjecutora?: string };
  empresa?: { ruc?: string; razonSocial?: string };
  contactoCliente?: { nombre?: string; cargo?: string };
  catalogoEmpresa?: { nombre?: string };
  fechaForm?: string | null;
  fechaEmision?: string | null;
  fechaMaxForm?: string | null;
  fechaMaxEntrega?: string | null;
  montoVenta?: string | number | null;
  direccionEntrega?: string;
  departamentoEntrega?: string;
  provinciaEntrega?: string;
  distritoEntrega?: string;
  referenciaEntrega?: string;
  estadoVenta?: string;
  documentoOce?: string;
  documentoOcf?: string;
  estadoCobranza?: string;
  fechaEstadoCobranza?: string | null;
  netoCobrado?: string;
  penalidad?: string;
  fechaProximaGestion?: string | null;
}

export const getCollections = async (): Promise<CollectionProps[]> => {
  try {
    // Obtenemos las órdenes de compra desde el endpoint de ventas (mismo backend)
    const response = await apiClient.get('/ordenes-compra');
    const ordenesCompra = response.data;

    // Transformamos las OCs manteniendo la estructura exacta de ventas
    const collections: CollectionProps[] = (ordenesCompra as OrdenCompraMinimal[]).map((oc) => ({
      id: oc.id,
      codigoVenta: oc.codigoVenta as string,
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
        nombre: oc.contactoCliente.nombre ?? '',
        cargo: oc.contactoCliente.cargo ?? '',
      } : undefined,
      catalogoEmpresa: oc.catalogoEmpresa ? {
        nombre: oc.catalogoEmpresa.nombre ?? '',
      } : undefined,
      fechaForm: oc.fechaForm ?? oc.fechaEmision ?? null,
      fechaMaxForm: oc.fechaMaxForm ?? oc.fechaMaxEntrega ?? null,
      montoVenta: typeof oc.montoVenta === 'number' ? String(oc.montoVenta) : (oc.montoVenta ?? '0'),
      direccionEntrega: oc.direccionEntrega,
      departamentoEntrega: oc.departamentoEntrega,
      provinciaEntrega: oc.provinciaEntrega,
      distritoEntrega: oc.distritoEntrega,
      referenciaEntrega: oc.referenciaEntrega,
      estadoVenta: oc.estadoVenta || 'PENDIENTE',
      documentoOce: oc.documentoOce,
      documentoOcf: oc.documentoOcf,
      // Campos específicos de cobranza
      estadoCobranza: oc.estadoCobranza,
      fechaEstadoCobranza: oc.fechaEstadoCobranza ?? null,
      netoCobrado: oc.netoCobrado,
      penalidad: oc.penalidad,
      fechaProximaGestion: oc.fechaProximaGestion ?? null,
    }));

    // Ordenar por fecha de creación descendente (más recientes primero)
    const toTime = (d: string | null): number => {
      const t = d ? new Date(d).getTime() : NaN;
      return Number.isFinite(t) ? t : 0;
    };
    const sortedCollections = collections.sort((a, b) => toTime(b.fechaForm) - toTime(a.fechaForm));

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
