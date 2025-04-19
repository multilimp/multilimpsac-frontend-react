import { supabase } from '@/integrations/supabase';
import { SupplierOrder, SupplierOrderFormInput } from '../models/supplier-order.model';
import { ISupplierOrderRepository, SupplierOrderFilter } from '../repositories/supplier-order.repository.interface';

export class SupplierOrderService implements ISupplierOrderRepository {
  private readonly TABLE_NAME = 'supplier_orders';

  async getAll(filters?: SupplierOrderFilter): Promise<{ data: SupplierOrder[]; count: number }> {
    let query = supabase
      .from(this.TABLE_NAME)
      .select('*', { count: 'exact' });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.supplierId) {
      query = query.eq('supplierId', filters.supplierId);
    }
    if (filters?.fromDate) {
      query = query.gte('date', filters.fromDate);
    }
    if (filters?.toDate) {
      query = query.lte('date', filters.toDate);
    }
    if (filters?.searchTerm) {
      query = query.or(`number.ilike.%${filters.searchTerm}%,supplierName.ilike.%${filters.searchTerm}%`);
    }

    const from = filters?.page ? (filters.page - 1) * (filters.pageSize || 10) : 0;
    const to = from + (filters.pageSize || 10) - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;
    
    if (error) throw error;
    
    return {
      data: (data as SupplierOrder[]) || [],
      count: count || 0
    };
  }

  async getById(id: string): Promise<SupplierOrder> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Supplier order not found');

    return data as SupplierOrder;
  }

  async create(formData: SupplierOrderFormInput): Promise<SupplierOrder> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .insert({
        ...formData,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data as SupplierOrder;
  }

  async update(id: string, formData: Partial<SupplierOrderFormInput>): Promise<SupplierOrder> {
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
    return data as SupplierOrder;
  }

  async updateStatus(id: string, status: SupplierOrder['status']): Promise<SupplierOrder> {
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
    return data as SupplierOrder;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}