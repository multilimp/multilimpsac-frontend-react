
import { Money } from '@/core/domain/types/value-objects';

export interface Tracking {
  id: {
    value: string;
  };
  orderNumber: string;
  clientName: string;
  date: {
    value: string;
  };
  total: Money;
  status: 'pending' | 'in_progress' | 'completed';
  items: TrackingItem[];
}

export interface TrackingItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  status: 'pending' | 'shipped' | 'delivered';
}

export interface TrackingFormInput {
  orderNumber: string;
  clientId: string;
  date: string;
  items: {
    id?: string;
    name: string;
    quantity: number;
    price: number;
    status: 'pending' | 'shipped' | 'delivered';
  }[];
  status: 'pending' | 'in_progress' | 'completed';
}
