
import { EntityBase } from "@/features/shared/models";
import { EntityId, Status, DateVO, Money } from "@/core/domain/types/value-objects";

export type QuotationStatus = 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';

export interface Quotation extends Omit<EntityBase, 'status' | 'id'> {
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
  paymentType?: string;
  paymentNote?: string;
  orderNote?: string;
  deliveryAddress?: string;
  deliveryDistrict?: string;
  deliveryProvince?: string;
  deliveryDepartment?: string;
  deliveryReference?: string;
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
  unitMeasure?: string;
  code?: string;
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
  contactId?: string;
  date: string;
  expiryDate: string;
  items: {
    productId?: string;
    productName: string;
    description: string;
    quantity: number;
    unitPrice: number;
    unitMeasure?: string;
    code?: string;
  }[];
  notes?: string;
  status: QuotationStatus;
  paymentType?: string;
  paymentNote?: string;
  orderNote?: string;
  deliveryAddress?: string;
  deliveryDistrict?: string;
  deliveryProvince?: string;
  deliveryDepartment?: string;
  deliveryReference?: string;
}
