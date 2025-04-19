
import { EntityId, Money, DateVO, Status } from '@/core/domain/types/value-objects';

export type QuotationStatus = "draft" | "sent" | "approved" | "rejected" | "expired";

export interface QuotationItem {
  id: EntityId;
  productId?: EntityId;
  productName: string;
  description: string;
  quantity: number;
  unitPrice: Money;
  total: Money;
  taxRate?: number;
  unitMeasure?: string;
  code?: string;
}

export interface Quotation {
  id: EntityId;
  number: string;
  clientId: EntityId;
  clientName: string;
  date: DateVO;
  expiryDate: DateVO;
  total: Money;
  status: Status;
  items: QuotationItem[];
  notes?: string;
  paymentNote?: string;
  paymentType?: string;
  orderNote?: string;
  deliveryAddress?: string;
  deliveryDistrict?: string;
  deliveryProvince?: string;
  deliveryDepartment?: string;
  deliveryReference?: string;
  createdBy: EntityId;
  createdAt: DateVO;
  updatedAt: DateVO;
}

export interface QuotationFilter {
  status?: Status;
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
  items: Array<{
    productId?: string;
    code?: string;
    productName: string;
    description?: string;
    unitMeasure?: string;
    quantity: number;
    unitPrice: number;
    taxRate?: number;
  }>;
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
