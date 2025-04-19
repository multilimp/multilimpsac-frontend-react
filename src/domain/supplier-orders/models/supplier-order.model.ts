
import { Money, EntityId, DateVO, Status } from '@/core/domain/types/value-objects';

export interface SupplierOrderId extends EntityId {
  value: string;
}

export interface SupplierOrder {
  id: SupplierOrderId;
  number: string;
  supplierId: EntityId;
  supplierName: string;
  date: DateVO;
  deliveryDate: DateVO | null;
  total: Money;
  status: Status;
  items: SupplierOrderItem[];
  paymentStatus: Status;
  paymentTerms: string;
  notes?: string;
  deliveryAddress?: string;
  createdAt: DateVO;
  updatedAt: DateVO;
}

export interface SupplierOrderItem {
  id: EntityId;
  productId: EntityId;
  productName: string;
  description: string;
  quantity: number;
  unitPrice: Money;
  total: Money;
  unitMeasure: string;
  expectedDeliveryDate: DateVO;
}

export interface SupplierOrderFormInput {
  supplierId: string;
  date: string;
  deliveryDate?: string;
  items?: Omit<SupplierOrderItem, "id" | "total">[];
  paymentTerms: string;
  notes?: string;
  deliveryAddress?: string;
  total: number;
}
