export interface OrderTracking {
  id: string;
  orderId: string;
  orderNumber: string;
  orderType: "sale" | "supplier";
  status: "pending" | "in_progress" | "delivered" | "cancelled";
  currentLocation?: string;
  estimatedDeliveryDate: string;
  actualDeliveryDate?: string;
  trackingEvents: TrackingEvent[];
  deliveryPerson?: string;
  vehicleId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrackingEvent {
  id: string;
  orderTrackingId: string;
  eventType: "created" | "picked_up" | "in_transit" | "delivered" | "delayed" | "cancelled";
  location: string;
  timestamp: string;
  notes?: string;
  createdBy: string;
}

export interface OrderTrackingFormInput {
  orderId: string;
  orderType: "sale" | "supplier";
  estimatedDeliveryDate: string;
  deliveryPerson?: string;
  vehicleId?: string;
  notes?: string;
}