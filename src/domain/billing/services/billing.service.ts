import { supabase } from '@/integrations/supabase';
import { Invoice, InvoiceFormInput } from '../models/billing.model';
import { IBillingRepository, InvoiceFilter } from '../repositories/billing.repository.interface';

export class BillingService implements IBillingRepository {
  private readonly TABLE_NAME = 'invoices';
  private readonly ITEMS_TABLE = 'invoice_items';

  async getAll(filters?: InvoiceFilter): Promise<{ data: Invoice[]; count: number }> {
    let query = supabase
      .from(this.TABLE_NAME)
      .select(`
        *,
        items:${this.ITEMS_TABLE}(*)
      `, { count: 'exact' });

    if (filters?.type) {
      query = query.eq('type', filters.type);
    }
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
    if (filters?.series) {
      query = query.eq('series', filters.series);
    }
    if (filters?.searchTerm) {
      query = query.or(`number.ilike.%${filters.searchTerm}%,clientName.ilike.%${filters.searchTerm}%`);
    }
    if (filters?.paymentStatus) {
      query = query.eq('paymentStatus', filters.paymentStatus);
    }

    const from = filters?.page ? (filters.page - 1) * (filters.pageSize || 10) : 0;
    const to = from + (filters.pageSize || 10) - 1;
    query = query.range(from, to).order('date', { ascending: false });

    const { data, error, count } = await query;
    
    if (error) throw error;
    
    return {
      data: (data as Invoice[]) || [],
      count: count || 0
    };
  }

  async getById(id: string): Promise<Invoice> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select(`
        *,
        items:${this.ITEMS_TABLE}(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Invoice not found');

    return data as Invoice;
  }

  async create(formData: InvoiceFormInput): Promise<Invoice> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .insert({
        ...formData,
        status: 'draft',
        paymentStatus: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .select(`
        *,
        items:${this.ITEMS_TABLE}(*)
      `)
      .single();

    if (error) throw error;
    return data as Invoice;
  }

  async update(id: string, formData: Partial<InvoiceFormInput>): Promise<Invoice> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .update({
        ...formData,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        items:${this.ITEMS_TABLE}(*)
      `)
      .single();

    if (error) throw error;
    return data as Invoice;
  }

  async updateStatus(id: string, status: Invoice['status']): Promise<Invoice> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .update({
        status,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        items:${this.ITEMS_TABLE}(*)
      `)
      .single();

    if (error) throw error;
    return data as Invoice;
  }

  async updatePaymentStatus(id: string, paymentStatus: Invoice['paymentStatus']): Promise<Invoice> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .update({
        paymentStatus,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        items:${this.ITEMS_TABLE}(*)
      `)
      .single();

    if (error) throw error;
    return data as Invoice;
  }

  async void(id: string): Promise<Invoice> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .update({
        status: 'void',
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        items:${this.ITEMS_TABLE}(*)
      `)
      .single();

    if (error) throw error;
    return data as Invoice;
  }

  async generateElectronicBilling(id: string): Promise<Invoice> {
    // Aquí iría la lógica para generar la facturación electrónica
    // Por ahora solo actualizamos el estado
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .update({
        electronicBillingStatus: 'sent',
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        items:${this.ITEMS_TABLE}(*)
      `)
      .single();

    if (error) throw error;
    return data as Invoice;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}