
// User models
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "manager";
  avatar?: string;
}

// Company models
export interface Company {
  id: string;
  name: string;
  ruc: string;
  address: string;
  phone: string;
  email: string;
  active: boolean;
  createdAt: string;
}

// Client models
export interface Client {
  id: string;
  name: string;
  ruc: string;
  address: string;
  phone: string;
  email: string;
  contactPerson: string;
  active: boolean;
  createdAt: string;
}

// Supplier models
export interface Supplier {
  id: string;
  name: string;
  ruc: string;
  address: string;
  phone: string;
  email: string;
  contactPerson: string;
  active: boolean;
  createdAt: string;
}

// Transport models
export interface Transport {
  id: string;
  name: string;
  ruc: string;
  address: string;
  phone: string;
  email: string;
  contactPerson: string;
  active: boolean;
  createdAt: string;
}

// Quotation models
export interface Quotation {
  id: string;
  number: string;
  clientId: string;
  date: string;
  expirationDate: string;
  items: QuotationItem[];
  total: number;
  status: "draft" | "sent" | "approved" | "rejected";
  createdAt: string;
}

export interface QuotationItem {
  id: string;
  productName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

// Sales models
export interface Sale {
  id: string;
  number: string;
  clientId: string;
  date: string;
  items: SaleItem[];
  total: number;
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
}

export interface SaleItem {
  id: string;
  productName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

// Purchase Order models
export interface PurchaseOrder {
  id: string;
  number: string;
  supplierId: string;
  date: string;
  deliveryDate: string;
  items: PurchaseOrderItem[];
  total: number;
  status: "pending" | "partial" | "completed" | "cancelled";
  createdAt: string;
}

export interface PurchaseOrderItem {
  id: string;
  productName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  receivedQuantity: number;
}

// Invoice models
export interface Invoice {
  id: string;
  number: string;
  clientId: string;
  saleId: string;
  date: string;
  dueDate: string;
  total: number;
  status: "pending" | "paid" | "partial" | "cancelled";
  createdAt: string;
}

// Collection models
export interface Collection {
  id: string;
  invoiceId: string;
  clientId: string;
  date: string;
  amount: number;
  paymentMethod: "cash" | "check" | "transfer" | "credit_card";
  reference: string;
  createdAt: string;
}

// Treasury models
export interface TreasuryMovement {
  id: string;
  date: string;
  type: "income" | "expense";
  category: string;
  description: string;
  amount: number;
  reference: string;
  createdAt: string;
}
