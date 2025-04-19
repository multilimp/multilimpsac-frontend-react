
export interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  amount: number;
  date: string;
  description: string;
  paymentMethod: string;
  reference: string;
  status: 'pending' | 'completed' | 'cancelled';
  accountId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Account {
  id: string;
  name: string;
  type: 'cash' | 'bank' | 'credit' | 'other';
  currency: string;
  balance: number;
  description?: string;
  isActive: boolean;
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
