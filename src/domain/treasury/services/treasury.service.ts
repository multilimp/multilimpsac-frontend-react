
import { supabase } from '@/integrations/supabase/client';
import { Transaction, Account, TransactionFormInput } from '../models/treasury.model';
import { ITreasuryRepository, TransactionFilter } from '../repositories/treasury.repository.interface';

export class TreasuryService implements ITreasuryRepository {
  private readonly TRANSACTIONS_TABLE = 'tesoreria_registros';
  private readonly ACCOUNTS_TABLE = 'tesoreria_cuentas';

  async getAllTransactions(filters?: TransactionFilter): Promise<{ data: Transaction[]; count: number }> {
    let query = supabase
      .from(this.TRANSACTIONS_TABLE)
      .select('*', { count: 'exact' });

    // Apply filters if they exist
    if (filters?.type) {
      // We'll handle type filtering in the application since it's derived from other fields
    }
    if (filters?.category) {
      // Category filtering would be handled in application logic
    }
    if (filters?.accountId) {
      // No direct account mapping in the database
    }
    if (filters?.fromDate) {
      query = query.gte('fecha_pago', filters.fromDate);
    }
    if (filters?.toDate) {
      query = query.lte('fecha_pago', filters.toDate);
    }
    if (filters?.searchTerm) {
      query = query.ilike('descripcion', `%${filters.searchTerm}%`);
    }

    // Pagination
    const from = filters?.page ? (filters.page - 1) * (filters.pageSize || 10) : 0;
    const to = from + (filters.pageSize || 10) - 1;
    query = query.range(from, to).order('fecha_pago', { ascending: false });

    const { data, error, count } = await query;
    
    if (error) throw error;
    
    return {
      data: (data || []).map(item => this.mapDbRowToTransaction(item)) as Transaction[],
      count: count || 0
    };
  }

  async getTransactionById(id: string): Promise<Transaction> {
    const { data, error } = await supabase
      .from(this.TRANSACTIONS_TABLE)
      .select('*')
      .eq('id', Number(id))
      .single();

    if (error) throw error;
    if (!data) throw new Error('Transaction not found');

    return this.mapDbRowToTransaction(data) as Transaction;
  }

  async createTransaction(formData: TransactionFormInput): Promise<Transaction> {
    const dbData = {
      descripcion: formData.description,
      fecha_pago: formData.date,
      total: formData.amount,
      banco: formData.paymentMethod || '',
      orden_compra_id: formData.referenceId ? Number(formData.referenceId) : null,
      orden_proveedor_id: formData.supplierId ? Number(formData.supplierId) : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from(this.TRANSACTIONS_TABLE)
      .insert(dbData)
      .select()
      .single();

    if (error) throw error;
    return this.mapDbRowToTransaction(data) as Transaction;
  }

  async updateTransaction(id: string, formData: Partial<TransactionFormInput>): Promise<Transaction> {
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (formData.description !== undefined) updateData.descripcion = formData.description;
    if (formData.date !== undefined) updateData.fecha_pago = formData.date;
    if (formData.amount !== undefined) updateData.total = formData.amount;
    if (formData.paymentMethod !== undefined) updateData.banco = formData.paymentMethod;

    const { data, error } = await supabase
      .from(this.TRANSACTIONS_TABLE)
      .update(updateData)
      .eq('id', Number(id))
      .select()
      .single();

    if (error) throw error;
    return this.mapDbRowToTransaction(data) as Transaction;
  }

  async deleteTransaction(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.TRANSACTIONS_TABLE)
      .delete()
      .eq('id', Number(id));

    if (error) throw error;
  }

  // Accounts methods implementation will be added in the future
  async getAllAccounts(): Promise<Account[]> {
    return [];
  }

  async getAccountById(id: string): Promise<Account> {
    throw new Error('Account not found');
  }

  async createAccount(formData: Omit<Account, 'id' | 'balance' | 'createdAt' | 'updatedAt'>): Promise<Account> {
    throw new Error('Not implemented');
  }

  async updateAccount(
    id: string, 
    formData: Partial<Omit<Account, 'id' | 'balance' | 'createdAt' | 'updatedAt'>>
  ): Promise<Account> {
    throw new Error('Not implemented');
  }

  async deleteAccount(id: string): Promise<void> {
    throw new Error('Not implemented');
  }

  // Helper method to map database rows to domain model
  private mapDbRowToTransaction(row: any): Transaction {
    return {
      id: row.id.toString(),
      type: this.determineTransactionType(row),
      category: 'expense', // Default category
      amount: Number(row.total) || 0,
      date: row.fecha_pago || new Date().toISOString(),
      description: row.descripcion || '',
      paymentMethod: row.banco || '',
      reference: row.orden_compra_id ? `OC-${row.orden_compra_id}` : '',
      status: 'completed',
      accountId: '1', // Default account ID
      createdAt: row.created_at || new Date().toISOString(),
      updatedAt: row.updated_at || new Date().toISOString()
    };
  }

  // Helper method to determine the transaction type based on database row
  private determineTransactionType(row: any): 'income' | 'expense' | 'transfer' {
    if (row.orden_proveedor_id) {
      return 'expense';
    } else if (row.orden_compra_id) {
      return 'income';
    }
    return 'expense'; // Default type
  }
}
