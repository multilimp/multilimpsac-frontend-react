import { Transaction, Account, TransactionFormInput } from '../models/treasury.model';

export interface TransactionFilter {
  type?: Transaction['type'];
  category?: string;
  accountId?: string;
  fromDate?: string;
  toDate?: string;
  searchTerm?: string;
  page?: number;
  pageSize?: number;
}

export interface ITreasuryRepository {
  getAllTransactions(filters?: TransactionFilter): Promise<{ data: Transaction[], count: number }>;
  getTransactionById(id: string): Promise<Transaction>;
  createTransaction(data: TransactionFormInput): Promise<Transaction>;
  updateTransaction(id: string, data: Partial<TransactionFormInput>): Promise<Transaction>;
  deleteTransaction(id: string): Promise<void>;
  
  getAllAccounts(): Promise<Account[]>;
  getAccountById(id: string): Promise<Account>;
  createAccount(data: Omit<Account, 'id' | 'balance' | 'createdAt' | 'updatedAt'>): Promise<Account>;
  updateAccount(id: string, data: Partial<Omit<Account, 'id' | 'balance' | 'createdAt' | 'updatedAt'>>): Promise<Account>;
  deleteAccount(id: string): Promise<void>;
}