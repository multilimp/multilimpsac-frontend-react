import { supabase } from '@/integrations/supabase';
import { Collection, CollectionFormInput, Payment } from '../models/collection.model';
import { ICollectionRepository, CollectionFilter } from '../repositories/collection.repository.interface';

export class CollectionService implements ICollectionRepository {
  private readonly TABLE_NAME = 'collections';
  private readonly PAYMENTS_TABLE = 'collection_payments';

  async getAll(filters?: CollectionFilter): Promise<{ data: Collection[]; count: number }> {
    let query = supabase
      .from(this.TABLE_NAME)
      .select(`
        *,
        payments:${this.PAYMENTS_TABLE}(*)
      `, { count: 'exact' });

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
      query = query.or(`invoiceNumber.ilike.%${filters.searchTerm}%,clientName.ilike.%${filters.searchTerm}%`);
    }

    const from = filters?.page ? (filters.page - 1) * (filters.pageSize || 10) : 0;
    const to = from + (filters.pageSize || 10) - 1;
    query = query.range(from, to).order('date', { ascending: false });

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
      .select(`
        *,
        payments:${this.PAYMENTS_TABLE}(*)
      `)
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
        balance: formData.amount,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .select(`
        *,
        payments:${this.PAYMENTS_TABLE}(*)
      `)
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
      .select(`
        *,
        payments:${this.PAYMENTS_TABLE}(*)
      `)
      .single();

    if (error) throw error;
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
      .select(`
        *,
        payments:${this.PAYMENTS_TABLE}(*)
      `)
      .single();

    if (error) throw error;
    return data as Collection;
  }

  async addPayment(
    collectionId: string, 
    payment: Omit<Payment, 'id' | 'collectionId' | 'createdAt' | 'createdBy'>
  ): Promise<Payment> {
    // Iniciamos una transacción para actualizar tanto el pago como la cobranza
    const { data: newPayment, error: paymentError } = await supabase
      .from(this.PAYMENTS_TABLE)
      .insert({
        ...payment,
        collectionId,
        createdAt: new Date().toISOString()
      })
      .select()
      .single();

    if (paymentError) throw paymentError;

    // Actualizamos el balance y estado de la cobranza
    const { data: collection } = await this.getById(collectionId);
    const newBalance = collection.balance - payment.amount;
    const newStatus = newBalance <= 0 ? 'completed' : 'partial';

    await this.update(collectionId, {
      balance: newBalance,
      status: newStatus
    });

    return newPayment as Payment;
  }

  async updatePayment(
    collectionId: string,
    paymentId: string,
    payment: Partial<Omit<Payment, 'id' | 'collectionId' | 'createdAt' | 'createdBy'>>
  ): Promise<Payment> {
    const { data, error } = await supabase
      .from(this.PAYMENTS_TABLE)
      .update(payment)
      .eq('id', paymentId)
      .eq('collectionId', collectionId)
      .select()
      .single();

    if (error) throw error;
    return data as Payment;
  }

  async deletePayment(collectionId: string, paymentId: string): Promise<void> {
    const { error } = await supabase
      .from(this.PAYMENTS_TABLE)
      .delete()
      .eq('id', paymentId)
      .eq('collectionId', collectionId);

    if (error) throw error;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}