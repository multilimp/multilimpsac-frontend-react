import { supabase } from '@/integrations/supabase/client';
import { Sale, SaleFormInput } from '../models/sale.model';
import { ISaleRepository, SaleFilter } from '../repositories/sale.repository.interface';

export class SaleService implements ISaleRepository {
  private readonly TABLE_NAME = 'sales';

  async getAll(filters?: SaleFilter): Promise<{ data: Sale[]; count: number }> {
    let query = supabase
      .from(this.TABLE_NAME)
      .select('*', { count: 'exact' });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.clientId) {
      query = query.eq('clientId', filters.clientId);
    }
    if (filters?.fromDate) {
      query = query.gte('date', filters.fromDate);
    }
    if (filters?.toDate) {
      query = query.lte('date', filters.toDate);
    }
    if (filters?.searchTerm) {
      query = query.or(`number.ilike.%${filters.searchTerm}%,clientName.ilike.%${filters.searchTerm}%`);
    }

    // Paginación
    const from = filters?.page ? (filters.page - 1) * (filters.pageSize || 10) : 0;
    const to = from + (filters.pageSize || 10) - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;
    
    if (error) throw error;
    
    return {
      data: (data as Sale[]) || [],
      count: count || 0
    };
  }

  async getById(id: string): Promise<Sale> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Sale not found');

    return data as Sale;
  }

  async create(formData: SaleFormInput): Promise<Sale> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .insert({
        ...formData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data as Sale;
  }

  async update(id: string, formData: Partial<SaleFormInput>): Promise<Sale> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .update({
        ...formData,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Sale;
  }

  async updateStatus(id: string, status: Sale['status']): Promise<Sale> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .update({
        status,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Sale;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
