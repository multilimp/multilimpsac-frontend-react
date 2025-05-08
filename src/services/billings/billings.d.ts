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
  deliveryDateOC: string;
  saleAmount: number;
  oce: string;
  ocf: string;
  receptionDate: string;
  programmingDate: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  grr?: string;
  isRefact: boolean;
  status: 'pending' | 'paid' | 'canceled' | 'processing';
}
