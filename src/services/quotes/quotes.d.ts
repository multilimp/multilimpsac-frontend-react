export interface QuoteProps {
    id: string | number;
    quoteNumber: string;
    client: string;
    date: string;
    validUntil: string;
    status: 'draft' | 'sent' | 'approved' | 'rejected';
    items: Array<{
      productId: string;
      quantity: number;
      unitPrice: number;
    }>;
    total: number;
  }