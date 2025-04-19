
import { supabase } from '@/integrations/supabase/client';
import { OrderTracking, OrderTrackingFormInput, TrackingEvent } from '../models/order-tracking.model';
import { IOrderTrackingRepository, OrderTrackingFilter } from '../repositories/order-tracking.repository.interface';

export class OrderTrackingService implements IOrderTrackingRepository {
  // Using existing tables in the database schema
  private readonly TABLE_NAME = 'historial_gestiones';

  async getAll(filters?: OrderTrackingFilter): Promise<{ data: OrderTracking[]; count: number }> {
    let query = supabase
      .from(this.TABLE_NAME)
      .select('*', { count: 'exact' });

    // Apply filters if provided
    if (filters?.orderId) {
      query = query.eq('orden_compra_id', Number(filters.orderId));
    }
    if (filters?.fromDate) {
      query = query.gte('fecha_gestion', filters.fromDate);
    }
    if (filters?.toDate) {
      query = query.lte('fecha_gestion', filters.toDate);
    }

    // Pagination
    const from = filters?.page ? (filters.page - 1) * (filters.pageSize || 10) : 0;
    const to = from + (filters.pageSize || 10) - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;
    
    if (error) throw error;
    
    // Map the DB rows to our domain model
    return {
      data: (data || []).map(item => this.mapDbRowToOrderTracking(item)) as OrderTracking[],
      count: count || 0
    };
  }

  async getById(id: string): Promise<OrderTracking> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select('*')
      .eq('id', Number(id))
      .single();

    if (error) throw error;
    if (!data) throw new Error('Order tracking not found');

    return this.mapDbRowToOrderTracking(data) as OrderTracking;
  }

  async create(formData: OrderTrackingFormInput): Promise<OrderTracking> {
    const dbData = {
      orden_compra_id: formData.orderId ? Number(formData.orderId) : null,
      descripcion: formData.description || '',
      fecha_gestion: formData.estimatedDeliveryDate || new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .insert(dbData)
      .select()
      .single();

    if (error) throw error;
    return this.mapDbRowToOrderTracking(data) as OrderTracking;
  }

  async update(id: string, formData: Partial<OrderTrackingFormInput>): Promise<OrderTracking> {
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (formData.orderId) updateData.orden_compra_id = Number(formData.orderId);
    if (formData.description) updateData.descripcion = formData.description;
    if (formData.estimatedDeliveryDate) updateData.fecha_gestion = formData.estimatedDeliveryDate;

    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .update(updateData)
      .eq('id', Number(id))
      .select()
      .single();

    if (error) throw error;
    return this.mapDbRowToOrderTracking(data) as OrderTracking;
  }

  async updateStatus(id: string, status: OrderTracking['status']): Promise<OrderTracking> {
    // Since our table doesn't have a status field, we'll update the description to indicate status change
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .update({
        descripcion: `Status updated to: ${status}`,
        updated_at: new Date().toISOString()
      })
      .eq('id', Number(id))
      .select()
      .single();

    if (error) throw error;
    
    // Return with the new status set
    const tracking = this.mapDbRowToOrderTracking(data);
    tracking.status = status;
    
    return tracking as OrderTracking;
  }

  async addTrackingEvent(id: string, event: Omit<TrackingEvent, 'id' | 'orderTrackingId'>): Promise<TrackingEvent> {
    // Since we don't have a dedicated tracking events table, 
    // we'll simulate it by updating the main tracking record's description
    const { data: existingTracking, error: fetchError } = await supabase
      .from(this.TABLE_NAME)
      .select('*')
      .eq('id', Number(id))
      .single();

    if (fetchError) throw fetchError;
    
    // Append the new event to the description
    const updatedDescription = `${existingTracking.descripcion || ''}\n\n[${event.eventType.toUpperCase()} - ${event.timestamp}]\n${event.location}: ${event.notes || ''}`;
    
    const { error: updateError } = await supabase
      .from(this.TABLE_NAME)
      .update({
        descripcion: updatedDescription,
        updated_at: new Date().toISOString()
      })
      .eq('id', Number(id));

    if (updateError) throw updateError;

    // Return a simulated tracking event
    return {
      id: `event-${Date.now()}`,
      orderTrackingId: id,
      eventType: event.eventType,
      timestamp: event.timestamp,
      location: event.location,
      notes: event.notes || '',
      createdBy: event.createdBy
    };
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.TABLE_NAME)
      .delete()
      .eq('id', Number(id));

    if (error) throw error;
  }

  // Helper method to map database rows to domain model
  private mapDbRowToOrderTracking(row: any): OrderTracking {
    return {
      id: row.id.toString(),
      orderId: row.orden_compra_id?.toString() || '',
      orderNumber: row.orden_compra_id?.toString() || '',
      orderType: 'sale', // Default to sale type
      status: 'in_progress', // Default status
      description: row.descripcion || '',
      estimatedDeliveryDate: row.fecha_gestion || new Date().toISOString(),
      trackingEvents: [],
      createdAt: row.created_at || new Date().toISOString(),
      updatedAt: row.updated_at || new Date().toISOString()
    };
  }
}
