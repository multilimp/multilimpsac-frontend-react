export interface SaleProps {
  id: string | number;
  saleNumber: string;
  saleCode?: string; // New field for sale code in format like "OC-GRU-XXXX"
  client: string;
  clientRuc?: string; // New field for client RUC
  date: string;
  formalDate?: string; // New field for formal date
  paymentMethod: 'cash' | 'credit' | 'transfer';
  status: 'completed' | 'pending' | 'refunded';
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
  }>;
  total: number;
  tax?: number;
  companyRuc?: string; // New field for company RUC
  companyName?: string; // New field for company name
  contact?: string; // New field for contact person
  catalog?: string; // New field for catalog
  deliveryDate?: string; // New field for delivery date
  observations?: string; // New field for observations
}

export interface SaleFilter {
  clientRuc?: string;
  companyRuc?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
}
