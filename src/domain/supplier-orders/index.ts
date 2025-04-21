
export interface SupplierOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplierName: string;
  date: string;
  deliveryDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  total: number;
  currency: string;
  items: SupplierOrderItem[];
}

export interface SupplierOrderItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
  deliveryStatus: 'pending' | 'partial' | 'complete';
}
