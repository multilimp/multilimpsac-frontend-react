export interface Sale {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  date: string;
  total: number;
  status: "pending" | "completed" | "cancelled";
  items: SaleItem[];
  quotationId?: string;
  paymentStatus: "pending" | "partial" | "completed";
  paymentType: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaleItem {
  id: string;
  productId: string;
  productName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  taxRate: number;
  unitMeasure: string;
}

export interface SaleFormInput {
  clientId: string;
  date: string;
  items: Omit<SaleItem, "id" | "total">[];
  quotationId?: string;
  paymentType: string;
  notes?: string;
}