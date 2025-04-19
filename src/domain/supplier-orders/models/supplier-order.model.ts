
export interface SupplierOrder {
  id: string;
  number: string;
  supplierId: string;
  supplierName: string;
  date: string;
  deliveryDate: string | null;
  total: number;
  status: "draft" | "sent" | "confirmed" | "received" | "cancelled";
  items: SupplierOrderItem[];
  paymentStatus: "pending" | "partial" | "completed";
  paymentTerms: string;
  notes?: string;
  deliveryAddress?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierOrderItem {
  id: string;
  productId: string;
  productName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  unitMeasure: string;
  expectedDeliveryDate: string;
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
