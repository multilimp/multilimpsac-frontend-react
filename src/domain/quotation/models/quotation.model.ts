
// Define the core domain model for quotation
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
  paymentNote?: string;
  paymentType?: string;
  orderNote?: string;
  deliveryAddress?: string;
  deliveryDistrict?: string;
  deliveryProvince?: string;
  deliveryDepartment?: string;
  deliveryReference?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuotationItem {
  id: string;
  productId?: string;
  productName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  taxRate?: number;
  unitMeasure?: string;
  code?: string;
}

// Form input model
export interface QuotationFormInput {
  clientId: string;
  contactId?: string;
  date: string;
  expiryDate: string;
  items: {
    id?: string;
    productId?: string;
    code?: string;
    productName: string;
    description?: string;
    unitMeasure?: string;
    quantity: number;
    unitPrice: number;
  }[];
  paymentType?: string;
  paymentNote?: string;
  orderNote?: string;
  deliveryAddress?: string;
  deliveryDistrict?: string;
  deliveryProvince?: string;
  deliveryDepartment?: string;
  deliveryReference?: string;
  status: "draft" | "sent" | "approved" | "rejected" | "expired";
}
