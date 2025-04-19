import { supabase } from '@/integrations/supabase/client';
import { Collection, CollectionFormInput } from '../models/collection.model';
import { ICollectionRepository, CollectionFilter } from '../repositories/collection.repository.interface';

export class CollectionService implements ICollectionRepository {
  private readonly TABLE_NAME = 'collections';

  async getAll(filters?: CollectionFilter): Promise<{ data: Collection[]; count: number }> {
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
      data: (data as Collection[]) || [],
      count: count || 0
    };
  }

  async getById(id: string): Promise<Collection> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Collection not found');

    return data as Collection;
  }

  async create(formData: CollectionFormInput): Promise<Collection> {
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
    return data as Collection;
  }

  async update(id: string, formData: Partial<CollectionFormInput>): Promise<Collection> {
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
    if (!data) throw new Error('Collection not found');
    
    return data as Collection;
  }

  async updateStatus(id: string, status: Collection['status']): Promise<Collection> {
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
    return data as Collection;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
