
import { supabase } from '@/integrations/supabase/client';
import { SupplierOrder, SupplierOrderFormInput, SupplierOrderId } from '../models/supplier-order.model';
import { ISupplierOrderRepository } from '../repositories/supplier-order.repository.interface';
import { SupplierOrderMapper } from '../mappers/supplier-order.mapper';
import { createEntityId, EntityId } from '@/core/domain/types/value-objects';

export class SupplierOrderService {
  private readonly TABLE_NAME = 'ordenes_proveedor';
  
  async getAll(filters?: any): Promise<{ data: SupplierOrder[]; count: number }> {
    let query = supabase
      .from(this.TABLE_NAME)
      .select(`
        id,
        codigo_op,
        proveedor_id,
        proveedores (razon_social),
        fecha_programada,
        fecha_entrega,
        tipo_pago,
        nota_pago,
        nota_pedido,
        estado_op,
        created_at,
        updated_at
      `, { count: 'exact' });
      
    // Apply filters if provided
    if (filters) {
      if (filters.supplierId) {
        query = query.eq('proveedor_id', Number(filters.supplierId));
      }
      
      if (filters.status) {
        query = query.eq('estado_op', filters.status.value);
      }
      
      if (filters.fromDate) {
        query = query.gte('fecha_programada', filters.fromDate);
      }
      
      if (filters.toDate) {
        query = query.lte('fecha_programada', filters.toDate);
      }
    }
    
    const { data, error, count } = await query;
    
    if (error) throw error;
    
    return {
      data: (data || []).map(SupplierOrderMapper.toDomain),
      count: count || 0
    };
  }

  async getById(id: SupplierOrderId): Promise<SupplierOrder> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select(`
        id,
        codigo_op,
        proveedor_id,
        proveedores (razon_social),
        fecha_programada,
        fecha_entrega,
        tipo_pago,
        nota_pago,
        nota_pedido,
        estado_op,
        created_at,
        updated_at
      `)
      .eq('id', Number(id.value))
      .single();
    
    if (error) throw error;
    
    return SupplierOrderMapper.toDomain(data);
  }

  // Method for direct creation using domain entity
  async create(entity: Omit<SupplierOrder, "id">): Promise<SupplierOrder> {
    // Convert domain entity to repository format
    const repoData = SupplierOrderMapper.toRepository(entity);
    
    // Insert into database
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .insert(repoData)
      .select()
      .single();
    
    if (error) throw error;
    
    // Return the created supplier order as domain model
    return SupplierOrderMapper.toDomain(data);
  }

  // Additional convenience method for form input
  async createFromForm(formData: SupplierOrderFormInput): Promise<SupplierOrder> {
    // Convert form data to domain model
    const domainData = SupplierOrderMapper.fromFormInput(formData);
    
    // Convert domain entity to repository format for database operation
    const repoData = SupplierOrderMapper.toRepository(domainData);
    
    // Insert into database
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .insert(repoData)
      .select()
      .single();
    
    if (error) throw error;
    
    // Return the created supplier order as domain model
    return SupplierOrderMapper.toDomain(data);
  }

  // Method for direct update using domain entity
  async update(id: SupplierOrderId, entity: Partial<SupplierOrder>): Promise<SupplierOrder> {
    // Convert domain entity to repository format
    const repoData = SupplierOrderMapper.toRepository(entity);
    
    // Update in database
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .update(repoData)
      .eq('id', Number(id.value))
      .select()
      .single();
    
    if (error) throw error;
    
    // Return the updated supplier order as domain model
    return SupplierOrderMapper.toDomain(data);
  }

  // Additional convenience method for form input
  async updateFromForm(id: SupplierOrderId, formData: Partial<SupplierOrderFormInput>): Promise<SupplierOrder> {
    // Convert form data to domain model (partial conversion)
    const partialDomainData = SupplierOrderMapper.fromFormInput(formData as SupplierOrderFormInput);
    
    // Convert domain entity to repository format for database operation
    const repoData = SupplierOrderMapper.toRepository(partialDomainData);
    
    // Update in database
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .update(repoData)
      .eq('id', Number(id.value))
      .select()
      .single();
    
    if (error) throw error;
    
    // Return the updated supplier order as domain model
    return SupplierOrderMapper.toDomain(data);
  }

  async delete(id: SupplierOrderId): Promise<void> {
    const { error } = await supabase
      .from(this.TABLE_NAME)
      .delete()
      .eq('id', Number(id.value));
    
    if (error) throw error;
  }
  
  async updateStatus(id: SupplierOrderId, status: any): Promise<SupplierOrder> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .update({ 
        estado_op: status.value,
        updated_at: new Date().toISOString() 
      })
      .eq('id', Number(id.value))
      .select()
      .single();
    
    if (error) throw error;
    
    return SupplierOrderMapper.toDomain(data);
  }
}
