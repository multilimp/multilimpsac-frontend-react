import { OrderTracking, OrderTrackingFormInput, TrackingEvent } from '../models/order-tracking.model';

export interface OrderTrackingFilter {
  status?: OrderTracking['status'];
  orderType?: OrderTracking['orderType'];
  orderId?: string;
  fromDate?: string;
  toDate?: string;
  deliveryPerson?: string;
  page?: number;
  pageSize?: number;
}

export interface IOrderTrackingRepository {
  getAll(filters?: OrderTrackingFilter): Promise<{ data: OrderTracking[], count: number }>;
  getById(id: string): Promise<OrderTracking>;
  create(data: OrderTrackingFormInput): Promise<OrderTracking>;
  update(id: string, data: Partial<OrderTrackingFormInput>): Promise<OrderTracking>;
  updateStatus(id: string, status: OrderTracking['status']): Promise<OrderTracking>;
  addTrackingEvent(id: string, event: Omit<TrackingEvent, 'id' | 'orderTrackingId'>): Promise<TrackingEvent>;
  delete(id: string): Promise<void>;
}