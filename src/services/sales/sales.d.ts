export interface SaleProps {
    id: string | number;
    saleNumber: string;
    client: string;
    date: string;
    paymentMethod: 'cash' | 'credit' | 'transfer';
    status: 'completed' | 'pending' | 'refunded';
    items: Array<{
      productId: string;
      quantity: number;
      unitPrice: number;
    }>;
    total: number;
    tax?: number;
  }