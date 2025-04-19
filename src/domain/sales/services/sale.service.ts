
import { supabase } from '@/integrations/supabase/client';
import { Sale, SaleFormInput } from '../models/sale.model';
import { ISaleRepository, SaleFilter } from '../repositories/sale.repository.interface';
import { SaleMapper } from '../mappers/sale.mapper';
import { createEntityId } from '@/core/domain/types/value-objects';

export class SaleService implements ISaleRepository {
  private readonly TABLE_NAME = 'ordenes_compra';

  async getAll(filters?: SaleFilter): Promise<{ data: Sale[]; count: number }> {
    let query = supabase
      .from(this.TABLE_NAME)
      .select('*', { count: 'exact' });

    if (filters?.status) {
      query = query.eq('etapa_actual', filters.status);
    }
    if (filters?.clientId) {
      query = query.eq('cliente_id', filters.clientId);
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

    const { data, error, count } = await query;
    
    if (error) throw error;
    
    return {
      data: SaleMapper.toDomainList(data || []),
      count: count || 0
    };
  }

  async getById(id: string): Promise<Sale> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('Sale not found');

    return SaleMapper.toDomain(data);
  }

  async create(formInput: SaleFormInput): Promise<Sale> {
    const saleData = SaleMapper.fromFormInput(formInput);
    const dbData = SaleMapper.toRepository(saleData);

    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .insert(dbData)
      .select()
      .single();

    if (error) throw error;
    return SaleMapper.toDomain(data);
  }

  async update(id: string, formInput: Partial<SaleFormInput>): Promise<Sale> {
    const saleData = SaleMapper.fromFormInput(formInput as SaleFormInput);
    const dbData = SaleMapper.toRepository(saleData);

    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .update(dbData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return SaleMapper.toDomain(data);
  }

  async updateStatus(id: string, status: Sale['status']['value']): Promise<Sale> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .update({
        etapa_actual: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return SaleMapper.toDomain(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
