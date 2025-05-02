export interface OrderProps {
  id: string | number;
  orderNumber: string;
  client: string;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
  total: number;
  items?: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
}
