
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SupplierOrder, SupplierOrderFormInput } from '../models/supplier-order.model';
import { SupplierOrderService } from '../services/supplier-order.service';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SupplierOrderMapper } from '../mappers/supplier-order.mapper';
import { createEntityId } from '@/core/domain/types/value-objects';

// Singleton instance of the service
const supplierOrderService = new SupplierOrderService();

// Hook to get all supplier orders
export const useSupplierOrders = (filters?: Record<string, any>) => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['supplier-orders', filters],
    queryFn: async () => {
      try {
        return await supplierOrderService.getAll(filters);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'No se pudieron cargar las órdenes de compra a proveedor',
          variant: 'destructive'
        });
        throw error;
      }
    }
  });
};

// Hook to get a single supplier order by id
export const useSupplierOrder = (id?: string) => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['supplier-order', id],
    queryFn: async () => {
      if (!id) return null;
      try {
        // Convert string id to SupplierOrderId
        const orderId = createEntityId(id);
        return await supplierOrderService.getById(orderId);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'No se pudo cargar la orden de compra a proveedor',
          variant: 'destructive'
        });
        throw error;
      }
    },
    enabled: !!id
  });
};

// Hook to create a new supplier order
export const useCreateSupplierOrder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: SupplierOrderFormInput) => {
      try {
        const domainOrder = SupplierOrderMapper.fromFormInput(data);
        return await supplierOrderService.create(domainOrder);
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-orders'] });
      toast({
        title: 'Orden creada',
        description: 'La orden de compra a proveedor ha sido creada con éxito',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'No se pudo crear la orden de compra a proveedor',
        variant: 'destructive'
      });
      console.error('Error creating supplier order:', error);
    }
  });
};

// Hook to update an existing supplier order
export const useUpdateSupplierOrder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string, data: Partial<SupplierOrderFormInput> }) => {
      try {
        // Convert string id to SupplierOrderId
        const orderId = createEntityId(id);
        
        // First get the existing order
        const existingOrder = await supplierOrderService.getById(orderId);
        if (!existingOrder) {
          throw new Error('Orden no encontrada');
        }
        
        // Convert the form input data to domain model
        // We need to handle the mixed types correctly
        const updatedDomainData = SupplierOrderMapper.updateFromFormInput(existingOrder, data);
        
        // Update with the properly typed domain model
        return await supplierOrderService.update(orderId, updatedDomainData);
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['supplier-orders'] });
      queryClient.invalidateQueries({ queryKey: ['supplier-order', variables.id] });
      toast({
        title: 'Orden actualizada',
        description: 'La orden de compra a proveedor ha sido actualizada con éxito',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la orden de compra a proveedor',
        variant: 'destructive'
      });
      console.error('Error updating supplier order:', error);
    }
  });
};

// Hook to delete a supplier order
export const useDeleteSupplierOrder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        // Convert string id to SupplierOrderId
        const orderId = createEntityId(id);
        return await supplierOrderService.delete(orderId);
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-orders'] });
      toast({
        title: 'Orden eliminada',
        description: 'La orden de compra a proveedor ha sido eliminada con éxito',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la orden de compra a proveedor',
        variant: 'destructive'
      });
      console.error('Error deleting supplier order:', error);
    }
  });
};
