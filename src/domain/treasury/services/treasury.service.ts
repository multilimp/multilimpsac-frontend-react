import { supabase } from '@/integrations/supabase/client';
import { Transaction, Account, TransactionFormInput } from '../models/treasury.model';
import { ITreasuryRepository, TransactionFilter } from '../repositories/treasury.repository.interface';

export class TreasuryService implements ITreasuryRepository {
  private readonly TRANSACTIONS_TABLE = 'transactions';
  private readonly ACCOUNTS_TABLE = 'accounts';

  async getAllTransactions(filters?: TransactionFilter): Promise<{ data: Transaction[]; count: number }> {
    let query = supabase
      .from(this.TRANSACTIONS_TABLE)
      .select('*', { count: 'exact' });

    if (filters?.type) {
      query = query.eq('type', filters.type);
    }
    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.accountId) {
      query = query.eq('accountId', filters.accountId);
    }
    if (filters?.fromDate) {
      query = query.gte('date', filters.fromDate);
    }
    if (filters?.toDate) {
      query = query.lte('date', filters.toDate);
    }
    if (filters?.searchTerm) {
      query = query.or(`description.ilike.%${filters.searchTerm}%,reference.ilike.%${filters.searchTerm}%`);
    }

    const from = filters?.page ? (filters.page - 1) * (filters.pageSize || 10) : 0;
    const to = from + (filters.pageSize || 10) - 1;
    query = query.range(from, to).order('date', { ascending: false });

    const { data, error, count } = await query;
    
    if (error) throw error;
    
    return {
      data: (data as Transaction[]) || [],
      count: count || 0
    };
  }

  async getTransactionById(id: string): Promise<Transaction> {
    const { data, error } = await supabase
      .from(this.TRANSACTIONS_TABLE)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Transaction not found');

    return data as Transaction;
  }

  async createTransaction(formData: TransactionFormInput): Promise<Transaction> {
    const { data, error } = await supabase
      .from(this.TRANSACTIONS_TABLE)
      .insert({
        ...formData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data as Transaction;
  }

  async updateTransaction(id: string, formData: Partial<TransactionFormInput>): Promise<Transaction> {
    const { data, error } = await supabase
      .from(this.TRANSACTIONS_TABLE)
      .update({
        ...formData,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Transaction;
  }

  async deleteTransaction(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.TRANSACTIONS_TABLE)
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Métodos para cuentas
  async getAllAccounts(): Promise<Account[]> {
    const { data, error } = await supabase
      .from(this.ACCOUNTS_TABLE)
      .select('*')
      .order('name');

    if (error) throw error;
    return (data as Account[]) || [];
  }

  async getAccountById(id: string): Promise<Account> {
    const { data, error } = await supabase
      .from(this.ACCOUNTS_TABLE)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Account not found');

    return data as Account;
  }

  async createAccount(formData: Omit<Account, 'id' | 'balance' | 'createdAt' | 'updatedAt'>): Promise<Account> {
    const { data, error } = await supabase
      .from(this.ACCOUNTS_TABLE)
      .insert({
        ...formData,
        balance: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data as Account;
  }

  async updateAccount(
    id: string, 
    formData: Partial<Omit<Account, 'id' | 'balance' | 'createdAt' | 'updatedAt'>>
  ): Promise<Account> {
    const { data, error } = await supabase
      .from(this.ACCOUNTS_TABLE)
      .update({
        ...formData,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Account;
  }

  async deleteAccount(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.ACCOUNTS_TABLE)
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
