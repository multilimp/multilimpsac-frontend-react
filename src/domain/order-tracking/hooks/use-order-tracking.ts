import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { OrderTrackingService } from '../services/order-tracking.service';
import type { OrderTracking, OrderTrackingFormInput, TrackingEvent } from '../models/order-tracking.model';
import type { OrderTrackingFilter } from '../repositories/order-tracking.repository.interface';

const orderTrackingService = new OrderTrackingService();
const ORDER_TRACKING_QUERY_KEY = 'order-tracking';

export const useOrderTrackings = (filters?: OrderTrackingFilter) => {
  return useQuery({
    queryKey: [ORDER_TRACKING_QUERY_KEY, filters],
    queryFn: () => orderTrackingService.getAll(filters),
  });
};

export const useOrderTracking = (id: string) => {
  return useQuery({
    queryKey: [ORDER_TRACKING_QUERY_KEY, id],
    queryFn: () => orderTrackingService.getById(id),
    enabled: !!id,
  });
};

export const useCreateOrderTracking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: OrderTrackingFormInput) => orderTrackingService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORDER_TRACKING_QUERY_KEY] });
    },
  });
};

export const useUpdateOrderTracking = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<OrderTrackingFormInput>) => orderTrackingService.update(id, data),
    onSuccess: (updatedTracking) => {
      queryClient.invalidateQueries({ queryKey: [ORDER_TRACKING_QUERY_KEY] });
      queryClient.setQueryData([ORDER_TRACKING_QUERY_KEY, id], updatedTracking);
    },
  });
};

export const useUpdateOrderTrackingStatus = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: OrderTracking['status']) => orderTrackingService.updateStatus(id, status),
    onSuccess: (updatedTracking) => {
      queryClient.invalidateQueries({ queryKey: [ORDER_TRACKING_QUERY_KEY] });
      queryClient.setQueryData([ORDER_TRACKING_QUERY_KEY, id], updatedTracking);
    },
  });
};

export const useAddTrackingEvent = (trackingId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (event: Omit<TrackingEvent, 'id' | 'orderTrackingId'>) => 
      orderTrackingService.addTrackingEvent(trackingId, event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORDER_TRACKING_QUERY_KEY, trackingId] });
    },
  });
};

export const useDeleteOrderTracking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => orderTrackingService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORDER_TRACKING_QUERY_KEY] });
    },
  });
};