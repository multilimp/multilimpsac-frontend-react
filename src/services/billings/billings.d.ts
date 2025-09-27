// src/services/billings/billings.d.ts
export interface BillingProps {
  id: number;
  ordenCompraId: number; // Cambiado de saleId para coincidir con BD
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
  // Campos de facturación
  factura?: string | null;
  fechaFactura?: string | null;
  grr?: string | null;
  retencion?: number | null;
  detraccion?: number | null;
  formaEnvioFactura?: string | null;
  estado?: number;
  notaCreditoArchivo?: string | null;
  notaCreditoTexto?: string | null;
  esRefacturacion?: boolean;
  idFacturaOriginal?: number | null;
  facturaArchivo?: string | null;
  grrArchivo?: string | null;
  createdAt?: string;
  updatedAt?: string;
  // Campos calculados para UI
  invoiceNumber?: string; // Alias para factura
  invoiceDate?: string; // Alias para fechaFactura
  isRefact?: boolean; // Alias para esRefacturacion
  status?: 'pending' | 'in_process' | 'billed' | 'cancelled'; // Mapeo de estado
  estadoFacturacion?: number; // Alias para estado
  facturacionId?: number | null; // Alias para id
}

export interface BillingUpdateData {
  factura?: string | null;
  fechaFactura?: string | null;
  grr?: string | null;
  retencion?: number | null;
  detraccion?: number | null;
  formaEnvioFactura?: string | null;
  estado?: number;
  notaCreditoArchivo?: string | null;
  notaCreditoTexto?: string | null;
  esRefacturacion?: boolean;
  idFacturaOriginal?: number | null;
  facturaArchivo?: string | null;
  grrArchivo?: string | null;
}

export interface BillingData {
  ordenCompraId: number;
  factura?: string | null;
  fechaFactura?: string | null; // Se envía como ISO string desde dayjs
  grr?: string | null;
  retencion?: number | null; // Decimal en BD
  detraccion?: number | null; // Decimal en BD
  formaEnvioFactura?: string | null;
  notaCreditoArchivo?: string | null;
  notaCreditoTexto?: string | null;
  esRefacturacion?: boolean; // Default false en BD
  idFacturaOriginal?: number | null;
  facturaArchivo?: string | null;
  grrArchivo?: string | null;
}