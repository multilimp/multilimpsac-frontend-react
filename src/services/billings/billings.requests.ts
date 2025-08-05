// src/services/billings/billings.requests.ts
import apiClient from '../apiClient';
import { BillingProps } from './billings.d';

export const getBillings = async (): Promise<BillingProps[]> => {
  try {
    // Primero obtenemos las órdenes de compra
    const ordenesCompraResponse = await apiClient.get('/ordenes-compra');
    const ordenesCompra = ordenesCompraResponse.data;
    
    // Creamos una promesa para obtener facturación de cada orden de compra
    const billingPromises = ordenesCompra.map(async (oc: any) => {
      let facturacionData = null;
      
      try {
        // Intentamos obtener la facturación existente para esta orden de compra
        const facturacionResponse = await apiClient.get(`/facturacion/orden-compra/${oc.id}`);
        facturacionData = facturacionResponse.data?.data || null;
      } catch (error) {
        // Si no existe facturación, lo manejamos silenciosamente
        console.log(`No hay facturación para orden de compra ${oc.id}`);
      }
      
      return {
        id: oc.id,
        saleId: oc.id,
        clientBusinessName: oc.cliente?.razonSocial || '',
        clientRuc: oc.cliente?.ruc || '',
        companyRuc: oc.empresa?.ruc || '',
        companyBusinessName: oc.empresa?.razonSocial || '',
        contact: oc.contactoCliente?.nombre || '',
        registerDate: oc.fechaEmision || new Date().toISOString(),
        maxDeliveryDate: oc.fechaMaxForm || new Date().toISOString(),
        deliveryDateOC: oc.fechaEntrega || undefined,
        saleAmount: parseFloat(oc.montoVenta || '0'),
        oce: oc.documentoOce || '',
        ocf: oc.documentoOcf || '',
        receptionDate: oc.fechaEntrega || new Date().toISOString(),
        programmingDate: oc.fechaMaxForm || new Date().toISOString(),
        // Datos de facturación real desde la tabla Facturación
        invoiceNumber: facturacionData?.factura || undefined,
        invoiceDate: facturacionData?.fechaFactura || undefined,
        grr: facturacionData?.grr || undefined,
        retencion: facturacionData?.retencion ? parseFloat(facturacionData.retencion.toString()) : undefined,
        detraccion: facturacionData?.detraccion ? parseFloat(facturacionData.detraccion.toString()) : undefined,
        formaEnvioFactura: facturacionData?.formaEnvioFactura || undefined,
        estadoFacturacion: facturacionData?.estado || 1,
        isRefact: false, // Campo calculado o predeterminado
        status: (oc.estadoActivo ? 'pending' : 'billed') as 'pending' | 'in_process' | 'billed' | 'cancelled',
        // ID de la facturación para updates
        facturacionId: facturacionData?.id || null,
      };
    });
    
    const billings = await Promise.all(billingPromises);
    return billings;
  } catch (error) {
    console.error('Error al obtener billings:', error);
    return [];
  }
};

export const createBilling = async (billingData: Omit<BillingProps, 'id'>): Promise<BillingProps> => {
  try {
    const response = await apiClient.post('/facturacion', billingData);
    return response.data;
  } catch (error) {
    console.error('Error al crear facturación:', error);
    throw error;
  }
};

export const updateBilling = async (id: number, billingData: Partial<BillingProps>): Promise<BillingProps> => {
  try {
    const response = await apiClient.put(`/facturacion/${id}`, billingData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar facturación:', error);
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

export const getBillingByOrdenCompraId = async (ordenCompraId: number): Promise<BillingProps | null> => {
  try {
    // Obtenemos la orden de compra
    const ocResponse = await apiClient.get(`/ordenes-compra/${ordenCompraId}`);
    const oc = ocResponse.data;
    
    if (!oc) return null;
    
    // Obtenemos la facturación para esta orden de compra
    let facturacionData = null;
    try {
      const facturacionResponse = await apiClient.get(`/facturacion/orden-compra/${ordenCompraId}`);
      facturacionData = facturacionResponse.data?.data || null;
    } catch (error) {
      console.log(`No hay facturación para orden de compra ${ordenCompraId}`);
    }
    
    return {
      id: oc.id,
      saleId: oc.id,
      clientBusinessName: oc.cliente?.razonSocial || '',
      clientRuc: oc.cliente?.ruc || '',
      companyRuc: oc.empresa?.ruc || '',
      companyBusinessName: oc.empresa?.razonSocial || '',
      contact: oc.contactoCliente?.nombre || '',
      registerDate: oc.fechaEmision || new Date().toISOString(),
      maxDeliveryDate: oc.fechaMaxForm || new Date().toISOString(),
      deliveryDateOC: oc.fechaEntrega || undefined,
      saleAmount: parseFloat(oc.montoVenta || '0'),
      oce: oc.documentoOce || '',
      ocf: oc.documentoOcf || '',
      receptionDate: oc.fechaEntrega || new Date().toISOString(),
      programmingDate: oc.fechaMaxForm || new Date().toISOString(),
      // Datos de facturación real desde la tabla Facturación
      invoiceNumber: facturacionData?.factura || undefined,
      invoiceDate: facturacionData?.fechaFactura || undefined,
      grr: facturacionData?.grr || undefined,
      retencion: facturacionData?.retencion ? parseFloat(facturacionData.retencion.toString()) : undefined,
      detraccion: facturacionData?.detraccion ? parseFloat(facturacionData.detraccion.toString()) : undefined,
      formaEnvioFactura: facturacionData?.formaEnvioFactura || undefined,
      estadoFacturacion: facturacionData?.estado || 1,
      isRefact: false,
      status: (oc.estadoActivo ? 'pending' : 'billed') as 'pending' | 'in_process' | 'billed' | 'cancelled',
      facturacionId: facturacionData?.id || null,
    };
  } catch (error) {
    console.error('Error al obtener facturación por orden de compra:', error);
    return null;
  }
};

export const createOrUpdateBilling = async (ordenCompraId: number, billingData: any): Promise<BillingProps> => {
  try {
    console.log('🔍 DEBUG: Llamando a createOrUpdateBilling');
    console.log('🔍 DEBUG: ordenCompraId:', ordenCompraId);
    console.log('🔍 DEBUG: billingData:', billingData);
    
    const response = await apiClient.post(`/facturacion/orden-compra/${ordenCompraId}`, billingData);
    
    console.log('✅ DEBUG: Respuesta del servidor:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ DEBUG: Error en createOrUpdateBilling:', error);
    console.error('❌ DEBUG: Response error:', (error as any)?.response?.data);
    console.error('❌ DEBUG: Status code:', (error as any)?.response?.status);
    throw error;
  }
};

export const generateInvoice = async (ordenCompraId: number, invoiceData: any): Promise<any> => {
  try {
    const response = await apiClient.post(`/facturacion/${ordenCompraId}/generar`, invoiceData);
    return response.data;
  } catch (error) {
    console.error('Error al generar factura:', error);
    throw error;
  }
}; 