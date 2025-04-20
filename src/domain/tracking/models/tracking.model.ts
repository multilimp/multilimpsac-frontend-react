
import { EntityId, DateVO, Status, Money } from "@/core/domain/types/value-objects";

export type TrackingId = EntityId;

export type TrackingStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface Tracking {
  id: TrackingId;
  orderNumber: string;
  clientId: EntityId;
  clientName: string;
  date: DateVO;
  total: Money;
  status: TrackingStatus;
  products: TrackingItem[];
}

export interface TrackingItem {
  id: string;
  productId?: string;
  productName: string;
  description: string;
  quantity: number;
  delivered: number;
  pending: number;
}
