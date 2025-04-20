
import { EntityId, DateVO, Status, Money } from "@/core/domain/types/value-objects";

export type BillingId = EntityId;

export type BillingStatus = 'pending' | 'billed' | 'cancelled';

export interface Billing {
  id: BillingId;
  orderNumber: string;
  clientId: EntityId;
  clientName: string;
  date: DateVO;
  billingDate: DateVO;
  total: Money;
  status: BillingStatus;
  invoiceNumber?: string;
  grNumber?: string;
}

// These interfaces are needed for the repository and services
export interface Invoice {
  id: string;
  number: string;
  series: string;
  type: 'factura' | 'boleta' | 'nota_credito' | 'nota_debito';
  clientId: string;
  clientName: string;
  clientDocument: string;
  clientDocumentType: 'ruc' | 'dni';
  date: string;
  dueDate: string;
  currency: 'PEN' | 'USD';
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'issued' | 'cancelled' | 'void';
  items: InvoiceItem[];
  saleId?: string;
  paymentStatus: 'pending' | 'partial' | 'completed';
  electronicBillingStatus?: 'pending' | 'sent' | 'accepted' | 'rejected';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  productId?: string;
  productName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  unitMeasure: string;
  discount?: number;
  taxRate: number;
  total: number;
}

export interface InvoiceFormInput {
  clientId: string;
  date: string;
  dueDate?: string;
  items?: Partial<InvoiceItem>[];
  notes?: string;
  currency?: 'PEN' | 'USD';
}
