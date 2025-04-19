
import { supabase } from '@/integrations/supabase/client';
import { Sale, SaleFormInput } from '../models/sale.model';
import { ISaleRepository, SaleFilter } from '../repositories/sale.repository.interface';

export class SaleService implements ISaleRepository {
  private readonly TABLE_NAME = 'ordenes_compra';

  async getAll(filters?: SaleFilter): Promise<{ data: Sale[]; count: number }> {
    let query = supabase
      .from(this.TABLE_NAME)
      .select('*', { count: 'exact' });

    if (filters?.status) {
      query = query.eq('etapa_actual', this.mapStatusToDbValue(filters.status));
    }
    if (filters?.clientId) {
      query = query.eq('cliente_id', Number(filters.clientId));
    }
    if (filters?.fromDate) {
      query = query.gte('fecha_form', filters.fromDate);
    }
    if (filters?.toDate) {
      query = query.lte('fecha_form', filters.toDate);
    }
    if (filters?.searchTerm) {
      query = query.or(`codigo_venta.ilike.%${filters.searchTerm}%,cliente_id.ilike.%${filters.searchTerm}%`);
    }

    // Paginación
    const from = filters?.page ? (filters.page - 1) * (filters.pageSize || 10) : 0;
    const to = from + (filters.pageSize || 10) - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;
    
    if (error) throw error;
    
    return {
      data: (data || []).map(item => this.mapDbRowToSale(item as any)) as Sale[],
      count: count || 0
    };
  }

  async getById(id: string): Promise<Sale> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select('*')
      .eq('id', Number(id))
      .single();

    if (error) throw error;
    if (!data) throw new Error('Sale not found');

    return this.mapDbRowToSale(data as any) as Sale;
  }

  async create(formData: SaleFormInput): Promise<Sale> {
    const dbData = {
      cliente_id: Number(formData.clientId),
      fecha_form: formData.date,
      monto_venta: this.calculateTotal(formData.items),
      etapa_actual: this.mapStatusToDbValue('pending'),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .insert(dbData)
      .select()
      .single();

    if (error) throw error;
    return this.mapDbRowToSale(data as any) as Sale;
  }

  async update(id: string, formData: Partial<SaleFormInput>): Promise<Sale> {
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (formData.clientId) updateData.cliente_id = Number(formData.clientId);
    if (formData.date) updateData.fecha_form = formData.date;
    if (formData.items) updateData.monto_venta = this.calculateTotal(formData.items);
    if (formData.notes) updateData.nota_op = formData.notes;

    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .update(updateData)
      .eq('id', Number(id))
      .select()
      .single();

    if (error) throw error;
    return this.mapDbRowToSale(data as any) as Sale;
  }

  async updateStatus(id: string, status: Sale['status']): Promise<Sale> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .update({
        etapa_actual: this.mapStatusToDbValue(status),
        updated_at: new Date().toISOString()
      })
      .eq('id', Number(id))
      .select()
      .single();

    if (error) throw error;
    return this.mapDbRowToSale(data as any) as Sale;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.TABLE_NAME)
      .delete()
      .eq('id', Number(id));

    if (error) throw error;
  }

  // Helper methods
  private calculateTotal(items: any[]): number {
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  }

  private mapStatusToDbValue(status: Sale['status']): string {
    switch (status) {
      case 'pending': return 'pendiente';
      case 'completed': return 'completado';
      case 'cancelled': return 'cancelado';
      default: return 'pendiente';
    }
  }

  private mapDbRowToSale(row: any): Sale {
    return {
      id: row.id.toString(),
      number: row.codigo_venta || '',
      clientId: row.cliente_id?.toString() || '',
      clientName: row.cliente_nombre || 'Cliente sin nombre',
      date: row.fecha_form || new Date().toISOString(),
      total: Number(row.monto_venta) || 0,
      status: this.mapDbStatusToModel(row.etapa_actual),
      items: [], // We would need to fetch these separately
      paymentStatus: 'pending',
      paymentType: row.tipo_pago || 'efectivo',
      notes: row.nota_op || '',
      createdBy: '',
      createdAt: row.created_at || new Date().toISOString(),
      updatedAt: row.updated_at || new Date().toISOString()
    };
  }

  private mapDbStatusToModel(dbStatus: string): Sale['status'] {
    switch (dbStatus) {
      case 'completado': return 'completed';
      case 'cancelado': return 'cancelled';
      default: return 'pending';
    }
  }
}
