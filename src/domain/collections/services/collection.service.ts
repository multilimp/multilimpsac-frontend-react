import { supabase } from '@/integrations/supabase/client';
import { Collection, CollectionFormInput, Payment } from '../models/collection.model';
import { ICollectionRepository, CollectionFilter } from '../repositories/collection.repository.interface';

export class CollectionService implements ICollectionRepository {
  private readonly TABLE_NAME = 'cobranzas';
  
  async getAll(filters?: CollectionFilter): Promise<{ data: Collection[]; count: number }> {
    let query = supabase
      .from(this.TABLE_NAME)
      .select('*', { count: 'exact' });

    if (filters?.status) {
      query = query.eq('estado_id', this.mapStatusToDbValue(filters.status));
    }
    if (filters?.clientId) {
      query = query.eq('cliente_id', parseInt(filters.clientId));
    }
    if (filters?.fromDate) {
      query = query.gte('fecha_vencimiento', filters.fromDate);
    }
    if (filters?.toDate) {
      query = query.lte('fecha_vencimiento', filters.toDate);
    }
    if (filters?.searchTerm) {
      query = query.or(`factura_id.ilike.%${filters.searchTerm}%,cliente_id.ilike.%${filters.searchTerm}%`);
    }

    // Paginación
    const from = filters?.page ? (filters.page - 1) * (filters.pageSize || 10) : 0;
    const to = from + (filters.pageSize || 10) - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;
    
    if (error) throw error;
    
    return {
      data: (data as any[] || []).map(item => this.mapDbRowToCollection(item)),
      count: count || 0
    };
  }

  async getById(id: string): Promise<Collection> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select('*')
      .eq('id', parseInt(id))
      .single();

    if (error) throw error;
    if (!data) throw new Error('Collection not found');

    return this.mapDbRowToCollection(data);
  }

  async create(formData: CollectionFormInput): Promise<Collection> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .insert({
        factura_id: parseInt(formData.invoiceId),
        cliente_id: formData.clientId ? parseInt(formData.clientId) : null,
        monto_total: formData.amount,
        monto_pendiente: formData.amount, // Initially, the pending amount is the same as the total
        fecha_vencimiento: formData.dueDate,
        observaciones: formData.notes,
        estado_id: this.mapStatusToDbValue('pending'),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapDbRowToCollection(data);
  }

  async update(id: string, formData: Partial<CollectionFormInput>): Promise<Collection> {
    const updateData: any = {
      updated_at: new Date().toISOString()
    };
    
    if (formData.invoiceId) updateData.factura_id = parseInt(formData.invoiceId);
    if (formData.amount) updateData.monto_total = formData.amount;
    if (formData.dueDate) updateData.fecha_vencimiento = formData.dueDate;
    if (formData.notes) updateData.observaciones = formData.notes;

    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .update(updateData)
      .eq('id', parseInt(id))
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Collection not found');
    
    return this.mapDbRowToCollection(data);
  }

  async updateStatus(id: string, status: Collection['status']): Promise<Collection> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .update({
        estado_id: this.mapStatusToDbValue(status),
        updated_at: new Date().toISOString()
      })
      .eq('id', parseInt(id))
      .select()
      .single();

    if (error) throw error;
    return this.mapDbRowToCollection(data);
  }

  async addPayment(collectionId: string, payment: Omit<Payment, 'id' | 'collectionId' | 'createdAt' | 'createdBy'>): Promise<Payment> {
    // Since we don't have a payments table in the current schema, we would implement 
    // this by updating the collection's pending amount and storing payment details in metadata
    const { data: collection, error: fetchError } = await supabase
      .from(this.TABLE_NAME)
      .select('*')
      .eq('id', parseInt(collectionId))
      .single();
      
    if (fetchError) throw fetchError;
    if (!collection) throw new Error('Collection not found');
    
    const newPendingAmount = Math.max(0, collection.monto_pendiente - payment.amount);
    const newStatus = newPendingAmount === 0 ? 'completed' : 'partial';
    
    // Update the collection with the new payment information
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .update({
        monto_pendiente: newPendingAmount,
        estado_id: this.mapStatusToDbValue(newStatus),
        updated_at: new Date().toISOString()
      })
      .eq('id', parseInt(collectionId))
      .select()
      .single();
      
    if (error) throw error;
    
    // Create a mock payment object since we don't have a real payments table
    return {
      id: `payment-${Date.now()}`,
      collectionId,
      amount: payment.amount,
      date: payment.date,
      method: payment.method,
      reference: payment.reference,
      notes: payment.notes,
      accountId: payment.accountId,
      createdBy: 'system',
      createdAt: new Date().toISOString()
    };
  }

  async updatePayment(collectionId: string, paymentId: string, payment: Partial<Omit<Payment, 'id' | 'collectionId' | 'createdAt' | 'createdBy'>>): Promise<Payment> {
    // Since we don't have a real payments table, this would be a placeholder
    return {
      id: paymentId,
      collectionId,
      amount: payment.amount || 0,
      date: payment.date || new Date().toISOString(),
      method: payment.method || 'cash',
      reference: payment.reference,
      notes: payment.notes,
      accountId: payment.accountId || '',
      createdBy: 'system',
      createdAt: new Date().toISOString()
    };
  }

  async deletePayment(collectionId: string, paymentId: string): Promise<void> {
    // Since we don't have a real payments table, this would be a placeholder
    console.log(`Deleting payment ${paymentId} from collection ${collectionId}`);
    // In a real implementation, this would remove the payment and update collection amounts
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.TABLE_NAME)
      .delete()
      .eq('id', parseInt(id));

    if (error) throw error;
  }

  // Helper methods for mapping between database and domain model
  private mapStatusToDbValue(status: Collection['status']): number {
    switch (status) {
      case 'pending': return 1;
      case 'partial': return 2;
      case 'completed': return 3;
      case 'overdue': return 4;
      default: return 1;
    }
  }

  private mapDbStatusToModel(statusId: number): Collection['status'] {
    switch (statusId) {
      case 1: return 'pending';
      case 2: return 'partial';
      case 3: return 'completed';
      case 4: return 'overdue';
      default: return 'pending';
    }
  }

  private mapDbRowToCollection(row: any): Collection {
    return {
      id: row.id.toString(),
      orderNumber: row.factura_id?.toString() || '',  // Used as orderNumber
      invoiceId: row.factura_id?.toString() || '',
      invoiceNumber: row.factura_id?.toString() || '',  // You may want to fetch the actual invoice number
      clientId: row.cliente_id?.toString() || '',
      clientName: row.cliente_name || '',  // This might need to be fetched from a client table
      date: row.created_at || new Date().toISOString(),
      dueDate: row.fecha_vencimiento || new Date().toISOString(),
      total: Number(row.monto_total) || 0,
      status: this.mapDbStatusToModel(row.estado_id),
      pendingAmount: Number(row.monto_pendiente) || 0,
      collectedAmount: Number(row.monto_total) - (Number(row.monto_pendiente) || 0),
      balance: Number(row.monto_pendiente) || 0,
      currency: 'PEN', // Default currency
      notes: row.observaciones || '',
      createdBy: row.created_by || '',
      createdAt: row.created_at || new Date().toISOString(),
      updatedAt: row.updated_at || new Date().toISOString()
    };
  }
}
