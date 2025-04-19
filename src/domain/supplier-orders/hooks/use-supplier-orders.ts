
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SupplierOrderService } from '../services/supplier-order.service';
import type { SupplierOrder, SupplierOrderFormInput } from '../models/supplier-order.model';
import type { SupplierOrderFilter } from '../repositories/supplier-order.repository.interface';
import { createEntityId } from '@/core/domain/types/value-objects';

const supplierOrderService = new SupplierOrderService();
const SUPPLIER_ORDERS_QUERY_KEY = 'supplier-orders';

export const useSupplierOrders = (filters?: SupplierOrderFilter) => {
  return useQuery({
    queryKey: [SUPPLIER_ORDERS_QUERY_KEY, filters],
    queryFn: () => supplierOrderService.getAll(filters),
  });
};

export const useSupplierOrder = (id: string) => {
  return useQuery({
    queryKey: [SUPPLIER_ORDERS_QUERY_KEY, id],
    queryFn: () => supplierOrderService.getById(createEntityId(id)),
    enabled: !!id,
  });
};

export const useCreateSupplierOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SupplierOrderFormInput) => supplierOrderService.createFromForm(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SUPPLIER_ORDERS_QUERY_KEY] });
    },
  });
};

export const useUpdateSupplierOrder = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SupplierOrderFormInput>) => 
      supplierOrderService.updateFromForm(createEntityId(id), data),
    onSuccess: (updatedOrder) => {
      queryClient.invalidateQueries({ queryKey: [SUPPLIER_ORDERS_QUERY_KEY] });
      queryClient.setQueryData([SUPPLIER_ORDERS_QUERY_KEY, id], updatedOrder);
    },
  });
};

export const useDeleteSupplierOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => supplierOrderService.delete(createEntityId(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SUPPLIER_ORDERS_QUERY_KEY] });
    },
  });
};
