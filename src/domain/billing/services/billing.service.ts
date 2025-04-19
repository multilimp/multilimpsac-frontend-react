
import { supabase } from '@/integrations/supabase/client';
import { Invoice, InvoiceFormInput } from '../models/billing.model';
import { IBillingRepository, InvoiceFilter } from '../repositories/billing.repository.interface';

export class BillingService implements IBillingRepository {
  private readonly TABLE_NAME = 'facturaciones';

  async getAll(filters?: InvoiceFilter): Promise<{ data: Invoice[]; count: number }> {
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
    
    // Map database results to Invoice interface
    const invoices = data?.map(item => this.mapDbRowToInvoice(item)) || [];
    
    return {
      data: invoices,
      count: count || 0
    };
  }

  async getById(id: string): Promise<Invoice> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Invoice not found');

    return this.mapDbRowToInvoice(data);
  }

  async create(formData: InvoiceFormInput): Promise<Invoice> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .insert({
        type: formData.type,
        clientId: formData.clientId,
        date: formData.date,
        dueDate: formData.dueDate,
        currency: formData.currency,
        items: JSON.stringify(formData.items),
        saleId: formData.saleId,
        status: 'draft',
        paymentStatus: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapDbRowToInvoice(data);
  }

  async update(id: string, formData: Partial<InvoiceFormInput>): Promise<Invoice> {
    const updateData: any = {
      ...formData,
      updated_at: new Date().toISOString()
    };
    
    if (formData.items) {
      updateData.items = JSON.stringify(formData.items);
    }

    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.mapDbRowToInvoice(data);
  }

  async updateStatus(id: string, status: Invoice['status']): Promise<Invoice> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .update({
        estado: this.mapStatusToDbValue(status),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.mapDbRowToInvoice(data);
  }

  async updatePaymentStatus(id: string, status: Invoice['paymentStatus']): Promise<Invoice> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .update({
        paymentStatus: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.mapDbRowToInvoice(data);
  }

  async void(id: string): Promise<Invoice> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .update({
        estado: this.mapStatusToDbValue('void'),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.mapDbRowToInvoice(data);
  }

  async generateElectronicBilling(id: string): Promise<Invoice> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .update({
        electronicBillingStatus: 'sent',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.mapDbRowToInvoice(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Helper methods for mapping between database and domain model
  private mapStatusToDbValue(status: Invoice['status']): number {
    switch (status) {
      case 'draft': return 0;
      case 'issued': return 1;
      case 'cancelled': return 2;
      case 'void': return 3;
      default: return 0;
    }
  }

  private mapDbStatusToModel(statusValue: number): Invoice['status'] {
    switch (statusValue) {
      case 0: return 'draft';
      case 1: return 'issued';
      case 2: return 'cancelled';
      case 3: return 'void';
      default: return 'draft';
    }
  }

  private mapDbRowToInvoice(row: any): Invoice {
    let items: InvoiceItem[] = [];
    try {
      items = typeof row.items === 'string' ? JSON.parse(row.items) : (row.items || []);
    } catch (e) {
      console.error('Error parsing invoice items:', e);
    }

    return {
      id: row.id,
      number: row.factura || '',
      series: row.serie || '',
      type: row.type || 'factura',
      clientId: row.orden_compra_id?.toString() || '',
      clientName: row.clientName || '',
      clientDocument: row.clientDocument || '',
      clientDocumentType: row.clientDocumentType || 'ruc',
      date: row.fecha_factura || new Date().toISOString(),
      dueDate: row.dueDate || new Date().toISOString(),
      currency: row.currency || 'PEN',
      subtotal: Number(row.subtotal) || 0,
      tax: Number(row.tax) || 0,
      total: Number(row.total) || 0,
      status: row.estado !== undefined ? this.mapDbStatusToModel(row.estado) : 'draft',
      items: items,
      saleId: row.saleId,
      paymentStatus: row.paymentStatus || 'pending',
      electronicBillingStatus: row.electronicBillingStatus || undefined,
      createdBy: row.createdBy || '',
      createdAt: row.created_at || new Date().toISOString(),
      updatedAt: row.updated_at || new Date().toISOString()
    };
  }
}
