
import { EntityBase } from "@/features/shared/models";

export interface PurchaseOrder extends EntityBase {
  orderNumber: string;
  clientId: string;
  clientName: string;
  date: string;
  total: number;
  status: "pending" | "partial" | "completed" | "cancelled";
  type: "public" | "private";
  documents: {
    oce?: string; // Orden de Compra Externa
    ocf?: string; // Orden de Compra Fiscal
  };
  items: PurchaseOrderItem[];
}

export interface PurchaseOrderItem {
  id: string;
  productId: string;
  productName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  taxRate?: number;
}

// Órdenes de Proveedores (OP)
export interface SupplierOrder extends EntityBase {
  orderNumber: string;
  purchaseOrderId: string; // Referencia a la OC
  supplierId: string;
  supplierName: string;
  transportId?: string;
  transportName?: string;
  date: string;
  deliveryDate: string;
  status: "pending" | "partial" | "completed" | "cancelled";
  paymentStatus: "pending" | "partial" | "completed";
  items: SupplierOrderItem[];
  total: number;
  payments: Payment[];
}

export interface SupplierOrderItem {
  id: string;
  productId: string;
  productName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  receivedQuantity: number;
}

export interface Payment {
  id: string;
  date: string;
  amount: number;
  method: "cash" | "transfer" | "check" | "credit";
  reference: string;
  notes?: string;
  createdAt: string;
}
