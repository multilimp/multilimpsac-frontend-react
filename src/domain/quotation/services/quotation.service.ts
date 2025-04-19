
import { supabase } from '@/integrations/supabase/client';
import { EntityId, Status } from '@/core/domain/types/value-objects';
import { Quotation, QuotationFormInput } from '../models/quotation.model';
import { IQuotationRepository, QuotationFilter } from '../repositories/quotation.repository.interface';
import { QuotationMapper } from '../mappers/quotation.mapper';

export class QuotationService implements IQuotationRepository {
  async getAll(filter?: QuotationFilter): Promise<{ data: Quotation[]; count: number; }> {
    try {
      let query = supabase
        .from('cotizaciones')
        .select(`
          id,
          codigo_cotizacion,
          cliente_id,
          clientes (razon_social),
          fecha_cotizacion,
          fecha_entrega,
          monto_total,
          estado,
          tipo_pago,
          nota_pago,
          nota_pedido,
          direccion_entrega,
          distrito_entrega,
          provincia_entrega,
          departamento_entrega,
          referencia_entrega,
          created_at,
          updated_at
        `, { count: 'exact' });
      
      // Apply filters
      if (filter) {
        if (filter.status) {
          query = query.eq('estado', filter.status);
        }
        
        if (filter.clientId) {
          query = query.eq('cliente_id', Number(filter.clientId));
        }
        
        if (filter.fromDate) {
          query = query.gte('fecha_cotizacion', filter.fromDate);
        }
        
        if (filter.toDate) {
          query = query.lte('fecha_cotizacion', filter.toDate);
        }
        
        if (filter.searchTerm) {
          query = query.or(`codigo_cotizacion.ilike.%${filter.searchTerm}%,clientes.razon_social.ilike.%${filter.searchTerm}%`);
        }

        // Apply pagination if provided
        if (filter.page && filter.pageSize) {
          const from = (filter.page - 1) * filter.pageSize;
          const to = from + filter.pageSize - 1;
          query = query.range(from, to);
        }
      }
      
      const { data, error, count } = await query;
      
      if (error) throw new Error(error.message);
      
      return {
        data: data.map(QuotationMapper.toDomain),
        count: count || 0
      };
    } catch (error) {
      console.error('Error fetching quotations:', error);
      throw error;
    }
  }

  async getById(id: EntityId): Promise<Quotation> {
    try {
      const { data: quotation, error: quotationError } = await supabase
        .from('cotizaciones')
        .select(`
          id,
          codigo_cotizacion,
          cliente_id,
          clientes (razon_social),
          fecha_cotizacion,
          fecha_entrega,
          monto_total,
          estado,
          tipo_pago,
          nota_pago,
          nota_pedido,
          direccion_entrega,
          distrito_entrega,
          provincia_entrega,
          departamento_entrega,
          referencia_entrega,
          created_at,
          updated_at
        `)
        .eq('id', Number(id.value))
        .single();
      
      if (quotationError) throw new Error(quotationError.message);

      const { data: items, error: itemsError } = await supabase
        .from('cotizacion_productos')
        .select('*')
        .eq('cotizacion_id', Number(id.value));
        
      if (itemsError) throw new Error(itemsError.message);
      
      return QuotationMapper.toDomain({ ...quotation, items });
    } catch (error) {
      console.error('Error fetching quotation:', error);
      throw error;
    }
  }

  async create(data: QuotationFormInput): Promise<Quotation> {
    try {
      const domainQuotation = QuotationMapper.fromFormInput(data);
      const repoData = QuotationMapper.toRepository(domainQuotation);

      const { data: quotation, error: quotationError } = await supabase
        .from('cotizaciones')
        .insert(repoData)
        .select()
        .single();
      
      if (quotationError) throw new Error(quotationError.message);

      // Insert items
      if (data.items?.length > 0) {
        const itemsToInsert = data.items.map(item => ({
          cotizacion_id: quotation.id,
          codigo: item.code,
          descripcion: item.description || item.productName,
          unidad_medida: item.unitMeasure,
          cantidad: item.quantity,
          precio_unitario: item.unitPrice,
          total: item.quantity * item.unitPrice
        }));

        const { error: itemsError } = await supabase
          .from('cotizacion_productos')
          .insert(itemsToInsert);

        if (itemsError) throw new Error(itemsError.message);
      }

      return this.getById(createEntityId(String(quotation.id)));
    } catch (error) {
      console.error('Error creating quotation:', error);
      throw error;
    }
  }

  async update(id: EntityId, data: Partial<QuotationFormInput>): Promise<Quotation> {
    try {
      const domainQuotation = QuotationMapper.fromFormInput(data as QuotationFormInput);
      const repoData = QuotationMapper.toRepository(domainQuotation);

      const { error: quotationError } = await supabase
        .from('cotizaciones')
        .update(repoData)
        .eq('id', Number(id.value));
      
      if (quotationError) throw new Error(quotationError.message);

      if (data.items) {
        // Delete existing items
        const { error: deleteError } = await supabase
          .from('cotizacion_productos')
          .delete()
          .eq('cotizacion_id', Number(id.value));
        
        if (deleteError) throw new Error(deleteError.message);

        // Insert new items
        const itemsToInsert = data.items.map(item => ({
          cotizacion_id: Number(id.value),
          codigo: item.code,
          descripcion: item.description || item.productName,
          unidad_medida: item.unitMeasure,
          cantidad: item.quantity,
          precio_unitario: item.unitPrice,
          total: item.quantity * item.unitPrice
        }));

        const { error: itemsError } = await supabase
          .from('cotizacion_productos')
          .insert(itemsToInsert);

        if (itemsError) throw new Error(itemsError.message);
      }

      return this.getById(id);
    } catch (error) {
      console.error('Error updating quotation:', error);
      throw error;
    }
  }

  async updateStatus(id: EntityId, status: Status): Promise<Quotation> {
    try {
      const { error } = await supabase
        .from('cotizaciones')
        .update({ estado: status.value })
        .eq('id', Number(id.value));
      
      if (error) throw new Error(error.message);
      
      return this.getById(id);
    } catch (error) {
      console.error('Error updating quotation status:', error);
      throw error;
    }
  }

  async delete(id: EntityId): Promise<void> {
    try {
      // Delete items first
      const { error: itemsError } = await supabase
        .from('cotizacion_productos')
        .delete()
        .eq('cotizacion_id', Number(id.value));
      
      if (itemsError) throw new Error(itemsError.message);

      // Delete quotation
      const { error: quotationError } = await supabase
        .from('cotizaciones')
        .delete()
        .eq('id', Number(id.value));
      
      if (quotationError) throw new Error(quotationError.message);
    } catch (error) {
      console.error('Error deleting quotation:', error);
      throw error;
    }
  }
}
