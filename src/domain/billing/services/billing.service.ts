import { supabase } from '@/integrations/supabase/client';
import { Billing, BillingFormInput } from '../models/billing.model';
import { IBillingRepository, BillingFilter } from '../repositories/billing.repository.interface';

export class BillingService implements IBillingRepository {
  private readonly TABLE_NAME = 'billings';

  async getAll(filters?: BillingFilter): Promise<{ data: Billing[]; count: number }> {
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
      data: (data as Billing[]) || [],
      count: count || 0
    };
  }

  async getById(id: string): Promise<Billing> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Billing not found');

    return data as Billing;
  }

  async create(formData: BillingFormInput): Promise<Billing> {
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
    return data as Billing;
  }

  async update(id: string, formData: Partial<BillingFormInput>): Promise<Billing> {
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
    return data as Billing;
  }

  async updateStatus(id: string, status: Billing['status']): Promise<Billing> {
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
    return data as Billing;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
