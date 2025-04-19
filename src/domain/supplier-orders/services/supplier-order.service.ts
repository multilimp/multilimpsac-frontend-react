
import { supabase } from '@/integrations/supabase/client';
import { SupplierOrder, SupplierOrderFormInput } from '../models/supplier-order.model';
import { ISupplierOrderRepository, SupplierOrderFilter } from '../repositories/supplier-order.repository.interface';

export class SupplierOrderService implements ISupplierOrderRepository {
  private readonly TABLE_NAME = 'ordenes_proveedor';

  async getAll(filters?: SupplierOrderFilter): Promise<{ data: SupplierOrder[]; count: number }> {
    let query = supabase
      .from(this.TABLE_NAME)
      .select('*', { count: 'exact' });

    if (filters?.status) {
      query = query.eq('estado_op', filters.status);
    }
    if (filters?.supplierId) {
      query = query.eq('proveedor_id', Number(filters.supplierId));
    }
    if (filters?.fromDate) {
      query = query.gte('fecha_entrega', filters.fromDate);
    }
    if (filters?.toDate) {
      query = query.lte('fecha_entrega', filters.toDate);
    }
    if (filters?.searchTerm) {
      query = query.or(`codigo_op.ilike.%${filters.searchTerm}%`);
    }

    // Pagination
    const from = filters?.page ? (filters.page - 1) * (filters.pageSize || 10) : 0;
    const to = from + (filters.pageSize || 10) - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;
    
    if (error) throw error;
    
    return {
      data: (data || []).map(item => this.mapDbRowToSupplierOrder(item)) as SupplierOrder[],
      count: count || 0
    };
  }

  async getById(id: string): Promise<SupplierOrder> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select('*')
      .eq('id', Number(id))
      .single();

    if (error) throw error;
    if (!data) throw new Error('Supplier order not found');

    return this.mapDbRowToSupplierOrder(data) as SupplierOrder;
  }

  async create(formData: SupplierOrderFormInput): Promise<SupplierOrder> {
    // Generate a supplier order code
    const orderCode = `OP-${Date.now().toString().slice(-6)}`;
    
    const dbData = {
      proveedor_id: formData.supplierId ? Number(formData.supplierId) : null,
      codigo_op: orderCode,
      fecha_entrega: formData.date || new Date().toISOString(),
      nota_pedido: formData.notes || '',
      total_proveedor: formData.total || 0,
      estado_op: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      activo: true
    };

    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .insert(dbData)
      .select()
      .single();

    if (error) throw error;
    return this.mapDbRowToSupplierOrder(data) as SupplierOrder;
  }

  async update(id: string, formData: Partial<SupplierOrderFormInput>): Promise<SupplierOrder> {
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (formData.supplierId) updateData.proveedor_id = Number(formData.supplierId);
    if (formData.date) updateData.fecha_entrega = formData.date;
    if (formData.notes) updateData.nota_pedido = formData.notes;
    if (formData.total !== undefined) updateData.total_proveedor = formData.total;

    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .update(updateData)
      .eq('id', Number(id))
      .select()
      .single();

    if (error) throw error;
    return this.mapDbRowToSupplierOrder(data) as SupplierOrder;
  }

  async updateStatus(id: string, status: SupplierOrder['status']): Promise<SupplierOrder> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .update({
        estado_op: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', Number(id))
      .select()
      .single();

    if (error) throw error;
    return this.mapDbRowToSupplierOrder(data) as SupplierOrder;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.TABLE_NAME)
      .delete()
      .eq('id', Number(id));

    if (error) throw error;
  }

  // Helper method to map database rows to domain model
  private mapDbRowToSupplierOrder(row: any): SupplierOrder {
    return {
      id: row.id.toString(),
      number: row.codigo_op || '',
      supplierId: row.proveedor_id?.toString() || '',
      supplierName: '', // Would need to be fetched from supplier table
      date: row.fecha_entrega || new Date().toISOString(),
      deliveryDate: row.fecha_programada || null,
      total: Number(row.total_proveedor) || 0,
      status: row.estado_op || 'draft',
      items: [], // Would need to fetch these separately
      paymentStatus: 'pending',
      paymentTerms: row.tipo_pago || '',
      notes: row.nota_pedido || '',
      deliveryAddress: '',
      createdAt: row.created_at || new Date().toISOString(),
      updatedAt: row.updated_at || new Date().toISOString()
    };
  }
}
