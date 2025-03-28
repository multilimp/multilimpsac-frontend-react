
export interface Quotation {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  date: string;
  expiryDate: string;
  total: number;
  status: "draft" | "sent" | "approved" | "rejected" | "expired";
  items: QuotationItem[];
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuotationItem {
  id: string;
  productId: string;
  productName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  taxRate?: number;
}
