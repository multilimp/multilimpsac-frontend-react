// src/services/trackings/trackings.d.ts

export interface TrackingProps {
  id: number;
  codigoOC?: string; // Código de la orden de compra, opcional
  codigoVenta?: string; // Código de la venta, opcional

  saleId: number;
  clientRuc: string;
  companyRuc: string;
  companyBusinessName: string;
  clientName: string;
  maxDeliveryDate: string | null;
  saleAmount: number;
  cue?: string;
  department?: string;
  oce?: string;
  ocf?: string;
  peruPurchases: boolean;
  grr?: string;
  invoiceNumber?: string;
  isRefact: boolean;
  peruPurchasesDate?: string | null;
  deliveryDateOC?: string | null;
  utility?: number;
  status: 'pending' | 'in_progress' | 'delivered' | 'canceled';
  createdAt?: string | null; // Fecha de creación para ordenamiento
}
