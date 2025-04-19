import { supabase } from '@/integrations/supabase/client';
import { SupplierOrder, SupplierOrderFormInput } from '../models/supplier-order.model';
import { ISupplierOrderRepository, SupplierOrderFilter } from '../repositories/supplier-order.repository.interface';
import { SupplierOrderMapper } from '../mappers/supplier-order.mapper';

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

    const from = filters?.page ? (filters.page - 1) * (filters.pageSize || 10) : 0;
    const to = from + (filters.pageSize || 10) - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;
    
    if (error) throw error;
    
    return {
      data: (data || []).map(item => SupplierOrderMapper.toDomain(item)),
      count: count || 0
    };
  }

  async getById(id: { value: string }): Promise<SupplierOrder> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select('*')
      .eq('id', Number(id.value))
      .single();

    if (error) throw error;
    if (!data) throw new Error('Supplier order not found');

    return SupplierOrderMapper.toDomain(data);
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
    return SupplierOrderMapper.toDomain(data);
  }

  async update(id: { value: string }, formData: Partial<SupplierOrderFormInput>): Promise<SupplierOrder> {
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
      .eq('id', Number(id.value))
      .select()
      .single();

    if (error) throw error;
    return SupplierOrderMapper.toDomain(data);
  }

  async delete(id: { value: string }): Promise<void> {
    const { error } = await supabase
      .from(this.TABLE_NAME)
      .delete()
      .eq('id', Number(id.value));

    if (error) throw error;
  }

  async updateStatus(id: { value: string }, status: string): Promise<SupplierOrder> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .update({
        estado_op: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', Number(id.value))
      .select()
      .single();

    if (error) throw error;
    return SupplierOrderMapper.toDomain(data);
  }

  private async mapAndValidateBeforeSave(formData: SupplierOrderFormInput): any {
    return {
      proveedor_id: Number(formData.supplierId),
      fecha_entrega: formData.date,
      fecha_programada: formData.deliveryDate,
      nota_pedido: formData.notes,
      total_proveedor: formData.total,
      estado_op: 'draft',
      tipo_pago: formData.paymentTerms,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      activo: true
    };
  }
}
