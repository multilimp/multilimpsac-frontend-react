import { supabase } from '@/integrations/supabase/client';
import { OrderTracking, OrderTrackingFormInput, TrackingEvent } from '../models/order-tracking.model';
import { IOrderTrackingRepository, OrderTrackingFilter } from '../repositories/order-tracking.repository.interface';

export class OrderTrackingService implements IOrderTrackingRepository {
  private readonly TABLE_NAME = 'order_tracking';
  private readonly EVENTS_TABLE = 'tracking_events';

  async getAll(filters?: OrderTrackingFilter): Promise<{ data: OrderTracking[]; count: number }> {
    let query = supabase
      .from(this.TABLE_NAME)
      .select(`
        *,
        trackingEvents:${this.EVENTS_TABLE}(*)
      `, { count: 'exact' });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.orderType) {
      query = query.eq('orderType', filters.orderType);
    }
    if (filters?.orderId) {
      query = query.eq('orderId', filters.orderId);
    }
    if (filters?.fromDate) {
      query = query.gte('estimatedDeliveryDate', filters.fromDate);
    }
    if (filters?.toDate) {
      query = query.lte('estimatedDeliveryDate', filters.toDate);
    }
    if (filters?.deliveryPerson) {
      query = query.eq('deliveryPerson', filters.deliveryPerson);
    }

    const from = filters?.page ? (filters.page - 1) * (filters.pageSize || 10) : 0;
    const to = from + (filters.pageSize || 10) - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;
    
    if (error) throw error;
    
    return {
      data: (data as OrderTracking[]) || [],
      count: count || 0
    };
  }

  async getById(id: string): Promise<OrderTracking> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select(`
        *,
        trackingEvents:${this.EVENTS_TABLE}(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Order tracking not found');

    return data as OrderTracking;
  }

  async create(formData: OrderTrackingFormInput): Promise<OrderTracking> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .insert({
        ...formData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .select(`
        *,
        trackingEvents:${this.EVENTS_TABLE}(*)
      `)
      .single();

    if (error) throw error;
    return data as OrderTracking;
  }

  async update(id: string, formData: Partial<OrderTrackingFormInput>): Promise<OrderTracking> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .update({
        ...formData,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        trackingEvents:${this.EVENTS_TABLE}(*)
      `)
      .single();

    if (error) throw error;
    return data as OrderTracking;
  }

  async updateStatus(id: string, status: OrderTracking['status']): Promise<OrderTracking> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .update({
        status,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        trackingEvents:${this.EVENTS_TABLE}(*)
      `)
      .single();

    if (error) throw error;
    return data as OrderTracking;
  }

  async addTrackingEvent(id: string, event: Omit<TrackingEvent, 'id' | 'orderTrackingId'>): Promise<TrackingEvent> {
    const { data, error } = await supabase
      .from(this.EVENTS_TABLE)
      .insert({
        ...event,
        orderTrackingId: id,
      })
      .select()
      .single();

    if (error) throw error;
    return data as TrackingEvent;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
