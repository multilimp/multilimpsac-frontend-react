
import { supabase } from '@/integrations/supabase/client';
import { SupplierContact, SupplierContactDB, mapSupplierContactFromDB, mapSupplierContactToDB } from '../models/supplierContact.model';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Service class for supplier contacts
export default class SupplierContactService {
  // Create a new supplier contact
  static async create(data: Omit<SupplierContact, 'id'>): Promise<SupplierContact> {
    try {
      const mappedData = mapSupplierContactToDB(data);
      
      const { data: newContact, error } = await supabase
        .from('contacto_proveedores')
        .insert(mappedData)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      if (!newContact) throw new Error('Failed to create supplier contact');
      
      return mapSupplierContactFromDB(newContact as SupplierContactDB);
    } catch (error) {
      console.error('Error creating supplier contact:', error);
      throw error;
    }
  }
  
  // Get all contacts for a supplier
  static async getBySupplierId(supplierId: string): Promise<SupplierContact[]> {
    try {
      const { data, error } = await supabase
        .from('contacto_proveedores')
        .select('*')
        .eq('proveedor_id', parseInt(supplierId))
        .order('nombre', { ascending: true });
      
      if (error) throw new Error(error.message);
      
      return (data as SupplierContactDB[]).map(mapSupplierContactFromDB);
    } catch (error) {
      console.error(`Error fetching contacts for supplier ID ${supplierId}:`, error);
      throw error;
    }
  }
  
  // Get a contact by ID
  static async getById(id: string): Promise<SupplierContact> {
    try {
      const { data, error } = await supabase
        .from('contacto_proveedores')
        .select('*')
        .eq('id', parseInt(id))
        .single();
      
      if (error) throw new Error(error.message);
      if (!data) throw new Error('Contact not found');
      
      return mapSupplierContactFromDB(data as SupplierContactDB);
    } catch (error) {
      console.error(`Error fetching contact with ID ${id}:`, error);
      throw error;
    }
  }
  
  // Update a contact
  static async update(id: string, updates: Partial<SupplierContact>): Promise<SupplierContact> {
    try {
      const mappedData = mapSupplierContactToDB(updates);
      
      const { data, error } = await supabase
        .from('contacto_proveedores')
        .update(mappedData)
        .eq('id', parseInt(id))
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      if (!data) throw new Error('Contact not found');
      
      return mapSupplierContactFromDB(data as SupplierContactDB);
    } catch (error) {
      console.error(`Error updating contact with ID ${id}:`, error);
      throw error;
    }
  }
  
  // Delete a contact
  static async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('contacto_proveedores')
        .delete()
        .eq('id', parseInt(id));
      
      if (error) throw new Error(error.message);
    } catch (error) {
      console.error(`Error deleting contact with ID ${id}:`, error);
      throw error;
    }
  }
}

// React hooks for supplier contacts
export const useSupplierContacts = (supplierId?: string) => {
  return useQuery({
    queryKey: ['supplierContacts', supplierId],
    queryFn: () => supplierId ? SupplierContactService.getBySupplierId(supplierId) : [],
    enabled: !!supplierId
  });
};

export const useSupplierContact = (id: string) => {
  return useQuery({
    queryKey: ['supplierContact', id],
    queryFn: () => SupplierContactService.getById(id),
    enabled: !!id
  });
};

export const useCreateSupplierContact = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: SupplierContactService.create,
    onSuccess: (_, variables) => {
      if (variables.supplierId) {
        queryClient.invalidateQueries({
          queryKey: ['supplierContacts', variables.supplierId]
        });
      }
    }
  });
};

export const useUpdateSupplierContact = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SupplierContact> }) =>
      SupplierContactService.update(id, data),
    onSuccess: (_, variables) => {
      if (variables.data.supplierId) {
        queryClient.invalidateQueries({
          queryKey: ['supplierContacts', variables.data.supplierId]
        });
      }
      queryClient.invalidateQueries({
        queryKey: ['supplierContact', variables.id]
      });
    }
  });
};

export const useDeleteSupplierContact = (supplierId?: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: SupplierContactService.delete,
    onSuccess: () => {
      if (supplierId) {
        queryClient.invalidateQueries({
          queryKey: ['supplierContacts', supplierId]
        });
      }
    }
  });
};
