// src/services/trackings/trackings.d.ts
export interface TrackingProps {
  id: number;
  saleId: number;
  clientRuc: string;
  companyRuc: string;
  companyBusinessName: string;
  clientName: string;
  maxDeliveryDate: string;
  saleAmount: number;
  cue?: string;
  department?: string;
  oce?: string;
  ocf?: string;
  peruPurchases: boolean;
  grr?: string;
  invoiceNumber?: string;
  isRefact: boolean;
  peruPurchasesDate?: string;
  deliveryDateOC?: string;
  utility?: number;
  status: 'pending' | 'in_progress' | 'delivered' | 'canceled';
}
