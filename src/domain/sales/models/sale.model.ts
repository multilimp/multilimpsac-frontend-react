
import { EntityId, Money, DateVO, Status } from '@/core/domain/types/value-objects';

export type SaleStatus = "pending" | "completed" | "cancelled";
export type PaymentStatus = "pending" | "partial" | "completed";

export interface Sale {
  id: EntityId;
  number: string;
  clientId: EntityId;
  clientName: string;
  date: DateVO;
  total: Money;
  status: Status;
  items: SaleItem[];
  quotationId?: EntityId;
  paymentStatus: Status;
  paymentType: string;
  notes?: string;
  createdBy: EntityId;
  createdAt: DateVO;
  updatedAt: DateVO;
}

export interface SaleItem {
  id: EntityId;
  productId: EntityId;
  productName: string;
  description: string;
  quantity: number;
  unitPrice: Money;
  total: Money;
  taxRate: number;
  unitMeasure: string;
}

export interface SaleFormInput {
  clientId: string;
  date: string;
  items: Array<{
    productId: string;
    productName: string;
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate: number;
    unitMeasure: string;
  }>;
  quotationId?: string;
  paymentType: string;
  notes?: string;
}
