
export interface OrderTracking {
  id: string;
  orderId: string;
  orderNumber: string;
  orderType: "sale" | "purchase" | "supplier";
  status: "pending" | "in_progress" | "in_transit" | "delivered" | "cancelled";
  description?: string;
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
  timestamp: string;
  location: string;
  notes?: string;
  createdBy: string;
}

export interface OrderTrackingFormInput {
  orderId: string;
  orderType: "sale" | "purchase" | "supplier";
  description?: string;
  estimatedDeliveryDate: string;
  date?: string; // Added for compatibility with existing code
  deliveryPerson?: string;
  vehicleId?: string;
  notes?: string;
}
