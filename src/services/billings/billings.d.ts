// src/services/billings/billings.d.ts
export interface BillingProps {
  id: number;
  saleId: number;
  clientBusinessName: string;
  clientRuc: string;
  companyRuc: string;
  companyBusinessName: string;
  contact: string;
  registerDate: string;
  maxDeliveryDate: string;
  deliveryDateOC?: string;
  saleAmount: number;
  oce: string;
  ocf: string;
  receptionDate: string;
  programmingDate: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  grr?: string;
  isRefact: boolean;
  status: 'pending' | 'in_process' | 'billed' | 'cancelled';
  // Campos específicos de facturación del backend
  factura?: string;
  fechaFactura?: string;
  retencion?: number;
  detraccion?: number;
  formaEnvioFactura?: string;
  estadoFacturacion?: number;
  // ID de la facturación para updates
  facturacionId?: number | null;
}

export interface BillingData {
  ordenCompraId: number;
  factura: string;
  fechaFactura: string;
  grr: string;
  retencion: number;
  detraccion: number;
  formaEnvioFactura: string;
  estado: number;
}