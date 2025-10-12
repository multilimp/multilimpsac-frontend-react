// src/services/billings/billings.requests.ts
import apiClient from '../apiClient';
import { BillingData, BillingProps, BillingUpdateData } from './billings.d';

// Tipos mínimos para evitar "any" del backend
interface OrdenCompraMinimal {
  id: number;
  cliente?: { razonSocial?: string; ruc?: string };
  empresa?: { ruc?: string; razonSocial?: string };
  contactoCliente?: { telefono?: string };
  fechaEmision?: string | null;
  fechaMaxForm?: string | null;
  fechaEntrega?: string | null;
  montoVenta?: string | number | null;
  documentoOce?: string | null;
  documentoOcf?: string | null;
  estadoActivo?: boolean;
}

interface FacturacionMinimal {
  id: number;
  factura?: string | null;
  fechaFactura?: string | null;
  grr?: string | null;
  retencion?: number | null;
  detraccion?: number | null;
  formaEnvioFactura?: string | null;
  estado?: number | null;
  esRefacturacion?: boolean;
  facturaArchivo?: string | null;
  grrArchivo?: string | null;
  notaCreditoArchivo?: string | null;
  notaCreditoTexto?: string | null;
  createdAt?: string | null;
}

export const getBillings = async (): Promise<BillingProps[]> => {
  try {
    // Obtenemos las órdenes de compra para crear la data de facturación
    const response = await apiClient.get('/ordenes-compra');
    const ordenesCompra = response.data;

    // Transformamos las OCs en datos de facturación
    const billings: BillingProps[] = (ordenesCompra as OrdenCompraMinimal[]).map((oc) => ({
      id: oc.id,
      ordenCompraId: oc.id,
      clientBusinessName: oc.cliente?.razonSocial || '',
      clientRuc: oc.cliente?.ruc || '',
      companyRuc: oc.empresa?.ruc || '',
      companyBusinessName: oc.empresa?.razonSocial || '',
      contact: oc.contactoCliente?.telefono || '',
      registerDate: oc.fechaEmision || null,
      maxDeliveryDate: oc.fechaMaxForm || null,
      deliveryDateOC: oc.fechaEntrega || null,
      saleAmount: parseFloat(String(oc.montoVenta ?? '0')),
      oce: oc.documentoOce || '',
      ocf: oc.documentoOcf || '',
      receptionDate: oc.fechaEntrega || null,
      programmingDate: oc.fechaMaxForm || null,
      invoiceNumber: undefined, // Campo pendiente de implementar
      invoiceDate: undefined, // Campo pendiente de implementar
      grr: undefined, // Campo pendiente de implementar
      isRefact: false, // Campo calculado o predeterminado
      status: oc.estadoActivo ? 'pending' : 'cancelled',
    }));

    return billings;
  } catch (error) {
    console.error('Error al obtener billings:', error);
    return [];
  }
};

export const createBilling = async (billingData: Omit<BillingData, 'id'>): Promise<BillingProps> => {
  try {
    const response = await apiClient.post('/facturacion', billingData);
    return response.data;
  } catch (error) {
    console.error('Error creating billing:', error);
    throw error;
  }
};

export const getBillingById = async (id: number): Promise<BillingProps | null> => {
  try {
    const response = await apiClient.get(`/facturacion/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener facturación por ID:', error);
    return null;
  }
};

export const updateBilling = async (id: number, billingData: Partial<BillingProps>): Promise<BillingProps> => {
  try {
    const response = await apiClient.put(`/facturacion/${id}`, billingData);
    return response.data;
  } catch (error) {
    console.error('Error updating billing:', error);
    throw error;
  }
};

export const patchBilling = async (id: number, billingData: BillingUpdateData): Promise<BillingProps> => {
  try {
    const response = await apiClient.patch(`/facturacion/${id}`, billingData);
    return response.data;
  } catch (error) {
    console.error('Error patching billing:', error);
    throw error;
  }
};

export const deleteBilling = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/facturacion/${id}`);
  } catch (error) {
    console.error('Error deleting billing:', error);
    throw error;
  }
};

// Función para obtener facturación por orden de compra ID (relación 1:1)
export const getBillingByOrdenCompraId = async (ordenCompraId: number): Promise<BillingProps | null> => {
  try {
    // Como ahora es 1:1, obtenemos directamente la orden de compra con su facturación
    const response = await apiClient.get(`/ordenes-compra/${ordenCompraId}?include=facturacion`);
    const ordenCompra = response.data as OrdenCompraMinimal & { facturacion?: FacturacionMinimal | null };

    if (!ordenCompra.facturacion) {
      return null;
    }

    const facturacion = ordenCompra.facturacion;

    return {
      id: facturacion.id,
      ordenCompraId: ordenCompra.id,
      clientBusinessName: ordenCompra.cliente?.razonSocial || '',
      clientRuc: ordenCompra.cliente?.ruc || '',
      companyRuc: ordenCompra.empresa?.ruc || '',
      companyBusinessName: ordenCompra.empresa?.razonSocial || '',
      contact: ordenCompra.contactoCliente?.telefono || '',
      registerDate: ordenCompra.fechaEmision || null,
      maxDeliveryDate: ordenCompra.fechaMaxForm || null,
      deliveryDateOC: ordenCompra.fechaEntrega || null,
      saleAmount: parseFloat(String(ordenCompra.montoVenta ?? '0')),
      oce: ordenCompra.documentoOce || '',
      ocf: ordenCompra.documentoOcf || '',
      receptionDate: ordenCompra.fechaEntrega || null,
      programmingDate: ordenCompra.fechaMaxForm || null,
      invoiceNumber: facturacion.factura ?? undefined,
      invoiceDate: facturacion.fechaFactura ?? undefined,
      grr: facturacion.grr ?? undefined,
      isRefact: false,
      // Campos específicos de facturación del backend
      factura: facturacion.factura ?? null,
      fechaFactura: facturacion.fechaFactura ?? null,
      retencion: facturacion.retencion ?? null,
      detraccion: facturacion.detraccion ?? null,
      formaEnvioFactura: facturacion.formaEnvioFactura ?? null,
      estadoFacturacion: facturacion.estado ?? undefined,
      facturacionId: facturacion.id,
      esRefacturacion: facturacion.esRefacturacion || false,
      // Campos de archivos que faltaban
      facturaArchivo: facturacion.facturaArchivo ?? null,
      grrArchivo: facturacion.grrArchivo ?? null,
      notaCreditoArchivo: facturacion.notaCreditoArchivo ?? null,
      notaCreditoTexto: facturacion.notaCreditoTexto ?? null
    };
  } catch (error) {
    console.error('Error al obtener facturación por orden de compra ID:', error);
    return null;
  }
};

// Función para crear o actualizar facturación (maneja la relación 1:1)
export const createOrUpdateBilling = async (ordenCompraId: number, billingData: BillingData): Promise<BillingProps> => {
  try {
    // Primero verificamos si ya existe una facturación para esta orden de compra
    const existingBilling = await getBillingByOrdenCompraId(ordenCompraId);

    if (existingBilling && existingBilling.facturacionId) {
      // Si existe, actualizamos
      const response = await apiClient.put(`/facturacion/${existingBilling.facturacionId}`, billingData);
      return response.data;
    } else {
      // Si no existe, creamos una nueva
      const response = await apiClient.post('/facturacion', billingData);
      return response.data;
    }
  } catch (error) {
    console.error('Error creating or updating billing:', error);
    throw error;
  }
};

// Función para obtener historial de facturaciones por orden de compra ID
export const getBillingHistoryByOrdenCompraId = async (ordenCompraId: number): Promise<BillingProps[]> => {
  try {
    console.log('🔍 Backend: Solicitando historial para orden:', ordenCompraId);
    // Cambiar a usar el endpoint directo de facturaciones
    const response = await apiClient.get(`/facturacion/orden-compra/${ordenCompraId}`);
    const facturaciones = response.data;
    console.log('📦 Backend: Facturaciones encontradas:', facturaciones);

    if (!Array.isArray(facturaciones)) {
      console.log('⚠️ Backend: No es array o no hay facturaciones');
      return [];
    }

    console.log('✅ Backend: Procesando', facturaciones.length, 'facturaciones');

    // Necesitamos obtener la información de la orden de compra para completar los datos
    const ordenResponse = await apiClient.get(`/ordenes-compra/${ordenCompraId}?include=cliente,empresa,contactoCliente`);
    const ordenCompra = ordenResponse.data as OrdenCompraMinimal;

    return (facturaciones as FacturacionMinimal[]).map((facturacion) => ({
      id: facturacion.id,
      ordenCompraId: ordenCompra.id,
      clientBusinessName: ordenCompra.cliente?.razonSocial || '',
      clientRuc: ordenCompra.cliente?.ruc || '',
      companyRuc: ordenCompra.empresa?.ruc || '',
      companyBusinessName: ordenCompra.empresa?.razonSocial || '',
      contact: ordenCompra.contactoCliente?.telefono || '',
      registerDate: ordenCompra.fechaEmision || null,
      maxDeliveryDate: ordenCompra.fechaMaxForm || null,
      deliveryDateOC: ordenCompra.fechaEntrega || null,
      saleAmount: parseFloat(String(ordenCompra.montoVenta ?? '0')),
      oce: ordenCompra.documentoOce || '',
      ocf: ordenCompra.documentoOcf || '',
      receptionDate: ordenCompra.fechaEntrega || null,
      programmingDate: ordenCompra.fechaMaxForm || null,
      invoiceNumber: facturacion.factura ?? undefined,
      invoiceDate: facturacion.fechaFactura ?? undefined,
      grr: facturacion.grr ?? undefined,
      isRefact: false,
      status: ordenCompra.estadoActivo ? 'pending' : 'cancelled',
      // Campos específicos de facturación del backend
      factura: facturacion.factura ?? null,
      fechaFactura: facturacion.fechaFactura ?? null,
      retencion: facturacion.retencion ?? null,
      detraccion: facturacion.detraccion ?? null,
      formaEnvioFactura: facturacion.formaEnvioFactura ?? null,
      estadoFacturacion: facturacion.estado ?? undefined,
      facturacionId: facturacion.id,
      createdAt: facturacion.createdAt ?? null,
      esRefacturacion: facturacion.esRefacturacion || false,
      // Campos de archivos que faltaban
      facturaArchivo: facturacion.facturaArchivo ?? null,
      grrArchivo: facturacion.grrArchivo ?? null,
      notaCreditoArchivo: facturacion.notaCreditoArchivo ?? null,
      notaCreditoTexto: facturacion.notaCreditoTexto ?? null
    }));
  } catch (error) {
    console.error('❌ Backend: Error al obtener historial de facturaciones:', error);
    return [];
  }
};

