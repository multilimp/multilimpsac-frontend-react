
import { EntityId, DateVO, Status, Money } from "@/core/domain/types/value-objects";

export type TreasuryId = EntityId;

export type PaymentStatus = 'pending' | 'partial' | 'completed';

export interface Treasury {
  id: TreasuryId;
  orderNumber: string;
  clientId: EntityId;
  clientName: string;
  date: DateVO;
  dueDate: DateVO;
  total: Money;
  paymentStatus: PaymentStatus;
  payments: Payment[];
}

export interface Payment {
  id: string;
  date: DateVO;
  amount: Money;
  method: string;
  reference: string;
}

// These interfaces are needed for the repository and services
export interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'transfer';
  category?: string;
  amount: number;
  date: string;
  description: string;
  paymentMethod?: string;
  reference?: string;
  status: 'pending' | 'completed' | 'cancelled';
  accountId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Account {
  id: string;
  name: string;
  type: 'cash' | 'bank' | 'credit' | 'other';
  currency: 'PEN' | 'USD';
  balance: number;
  isActive: boolean;
  description?: string;
  accountNumber?: string;
  bankName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFormInput {
  type?: 'income' | 'expense' | 'transfer';
  category?: string;
  amount: number;
  date: string;
  description: string;
  paymentMethod?: string;
  reference?: string;
  accountId?: string;
  referenceId?: string;
  supplierId?: string;
}
