
import { supabase } from '@/integrations/supabase/client';
import { Supplier, SupplierDB, mapSupplierFromDB, mapSupplierToDB } from '../models/supplier.model';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

// Core service functions
export const supplierService = {
  // Fetch all suppliers
  fetchSuppliers: async (): Promise<Supplier[]> => {
    try {
      const { data, error } = await supabase
        .from('proveedores')
        .select('*')
        .order('razon_social', { ascending: true });
      
      if (error) throw new Error(error.message);
      
      return (data as SupplierDB[]).map(mapSupplierFromDB);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      throw error;
    }
  },
  
  // Fetch a single supplier by ID
  fetchSupplierById: async (id: string): Promise<Supplier> => {
    try {
      const { data, error } = await supabase
        .from('proveedores')
        .select('*')
        .eq('id', parseInt(id))
        .single();
      
      if (error) throw new Error(error.message);
      if (!data) throw new Error('Supplier not found');
      
      return mapSupplierFromDB(data as SupplierDB);
    } catch (error) {
      console.error(`Error fetching supplier with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Create a new supplier
  createSupplier: async (supplier: Omit<Supplier, 'id'>): Promise<Supplier> => {
    try {
      const mappedData = mapSupplierToDB(supplier);
      
      const { data, error } = await supabase
        .from('proveedores')
        .insert(mappedData)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      if (!data) throw new Error('Failed to create supplier');
      
      return mapSupplierFromDB(data as SupplierDB);
    } catch (error) {
      console.error('Error creating supplier:', error);
      throw error;
    }
  },
  
  // Update an existing supplier
  updateSupplier: async (id: string, supplier: Partial<Supplier>): Promise<Supplier> => {
    try {
      const mappedData = mapSupplierToDB(supplier);
      
      const { data, error } = await supabase
        .from('proveedores')
        .update(mappedData)
        .eq('id', parseInt(id))
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      if (!data) throw new Error('Supplier not found');
      
      return mapSupplierFromDB(data as SupplierDB);
    } catch (error) {
      console.error(`Error updating supplier with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Delete a supplier
  deleteSupplier: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('proveedores')
        .delete()
        .eq('id', parseInt(id));
      
      if (error) throw new Error(error.message);
    } catch (error) {
      console.error(`Error deleting supplier with ID ${id}:`, error);
      throw error;
    }
  }
};

// React hooks for the supplier domain
export const useSuppliers = () => {
  return useQuery({
    queryKey: ['suppliers'],
    queryFn: supplierService.fetchSuppliers
  });
};

export const useSupplier = (id: string) => {
  return useQuery({
    queryKey: ['suppliers', id],
    queryFn: () => supplierService.fetchSupplierById(id),
    enabled: !!id
  });
};

export const useCreateSupplier = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: supplierService.createSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast({
        title: "Proveedor creado",
        description: "El proveedor ha sido creado exitosamente"
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudo crear el proveedor: ${error.message}`
      });
    }
  });
};

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Supplier> }) =>
      supplierService.updateSupplier(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['suppliers', variables.id] });
      toast({
        title: "Proveedor actualizado",
        description: "El proveedor ha sido actualizado exitosamente"
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudo actualizar el proveedor: ${error.message}`
      });
    }
  });
};

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: supplierService.deleteSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast({
        title: "Proveedor eliminado",
        description: "El proveedor ha sido eliminado exitosamente"
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudo eliminar el proveedor: ${error.message}`
      });
    }
  });
};
