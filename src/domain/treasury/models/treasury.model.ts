
import { Money } from '@/core/domain/types/value-objects';

export interface Treasury {
  id: string;
  orderNumber: string;
  clientName: string;
  date: {
    value: string;
  };
  dueDate: {
    value: string;
  };
  amount: Money;
  paymentStatus: 'pending' | 'partial' | 'completed';
  paymentMethod: string;
  notes?: string;
}

export interface TreasuryFormInput {
  orderNumber: string;
  clientId: string;
  date: string;
  dueDate: string;
  amount: {
    value: number;
    currency: string;
  };
  paymentMethod: string;
  notes?: string;
}
