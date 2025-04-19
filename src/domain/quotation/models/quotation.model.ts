
import { EntityBase } from "@/features/shared/models";
import { EntityId, Status, DateVO, Money } from "@/core/domain/types/value-objects";

export type QuotationStatus = 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';

export interface Quotation extends Omit<EntityBase, 'status'> {
  id: EntityId;
  number: string;
  clientId: EntityId;
  clientName: string;
  date: DateVO;
  expiryDate: DateVO;
  total: Money;
  status: QuotationStatus;
  items: QuotationItem[];
  notes?: string;
  createdBy: string;
}

export interface QuotationItem {
  id: string;
  productId?: string;
  productName: string;
  description: string;
  quantity: number;
  unitPrice: Money;
  total: Money;
  taxRate?: number;
}

export interface QuotationFilter {
  status?: QuotationStatus;
  clientId?: string;
  fromDate?: string;
  toDate?: string;
  searchTerm?: string;
  page?: number;
  pageSize?: number;
}

export interface QuotationFormInput {
  clientId: string;
  date: string;
  expiryDate: string;
  items: {
    productId?: string;
    productName: string;
    description: string;
    quantity: number;
    unitPrice: number;
  }[];
  notes?: string;
  status: QuotationStatus;
}
