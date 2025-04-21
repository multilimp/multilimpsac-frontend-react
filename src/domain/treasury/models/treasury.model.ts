
import { Money } from '@/core/domain/types/value-objects';

export interface Transaction {
  id: {
    value: string;
  };
  reference: string;
  date: {
    value: string;
  };
  amount: Money;
  type: 'income' | 'expense';
  description: string;
  category: string;
  accountId: string;
  status: 'pending' | 'completed' | 'rejected';
}

export interface Account {
  id: {
    value: string;
  };
  name: string;
  number: string;
  bank: string;
  balance: Money;
  type: 'checking' | 'savings' | 'cash';
  currency: string;
  isActive: boolean;
}

export interface TransactionFormInput {
  reference: string;
  date: string;
  amount: number;
  currency: string;
  type: 'income' | 'expense';
  description: string;
  category: string;
  accountId: string;
  status: 'pending' | 'completed' | 'rejected';
}
