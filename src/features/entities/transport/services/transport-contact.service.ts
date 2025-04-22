
import { supabase } from '@/integrations/supabase/client';
import { TransportContact, TransportContactDB, mapTransportContactFromDB, mapTransportContactToDB } from '../models/transportContact.model';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Service class for transport contacts
export default class TransportContactService {
  // Create a new transport contact
  static async create(data: Partial<TransportContact>): Promise<TransportContact> {
    try {
      const mappedData = mapTransportContactToDB(data);
      
      const { data: newContact, error } = await supabase
        .from('contacto_transportes')
        .insert(mappedData)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      if (!newContact) throw new Error('Failed to create transport contact');
      
      return mapTransportContactFromDB(newContact as TransportContactDB);
    } catch (error) {
      console.error('Error creating transport contact:', error);
      throw error;
    }
  }
  
  // Get all contacts for a transport
  static async getByTransportId(transportId: string): Promise<TransportContact[]> {
    try {
      const { data, error } = await supabase
        .from('contacto_transportes')
        .select('*')
        .eq('transporte_id', parseInt(transportId))
        .order('nombre', { ascending: true });
      
      if (error) throw new Error(error.message);
      
      return (data as TransportContactDB[]).map(mapTransportContactFromDB);
    } catch (error) {
      console.error(`Error fetching contacts for transport ID ${transportId}:`, error);
      throw error;
    }
  }
  
  // Get a contact by ID
  static async getById(id: string): Promise<TransportContact> {
    try {
      const { data, error } = await supabase
        .from('contacto_transportes')
        .select('*')
        .eq('id', parseInt(id))
        .single();
      
      if (error) throw new Error(error.message);
      if (!data) throw new Error('Contact not found');
      
      return mapTransportContactFromDB(data as TransportContactDB);
    } catch (error) {
      console.error(`Error fetching contact with ID ${id}:`, error);
      throw error;
    }
  }
  
  // Update a contact
  static async update(id: string, updates: Partial<TransportContact>): Promise<TransportContact> {
    try {
      const mappedData = mapTransportContactToDB(updates);
      
      const { data, error } = await supabase
        .from('contacto_transportes')
        .update(mappedData)
        .eq('id', parseInt(id))
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      if (!data) throw new Error('Contact not found');
      
      return mapTransportContactFromDB(data as TransportContactDB);
    } catch (error) {
      console.error(`Error updating contact with ID ${id}:`, error);
      throw error;
    }
  }
  
  // Delete a contact
  static async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('contacto_transportes')
        .delete()
        .eq('id', parseInt(id));
      
      if (error) throw new Error(error.message);
    } catch (error) {
      console.error(`Error deleting contact with ID ${id}:`, error);
      throw error;
    }
  }
}

// React hooks for transport contacts
export const useTransportContacts = (transportId?: string) => {
  return useQuery({
    queryKey: ['transportContacts', transportId],
    queryFn: () => transportId ? TransportContactService.getByTransportId(transportId) : [],
    enabled: !!transportId
  });
};

export const useTransportContact = (id: string) => {
  return useQuery({
    queryKey: ['transportContact', id],
    queryFn: () => TransportContactService.getById(id),
    enabled: !!id
  });
};

export const useCreateTransportContact = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: TransportContactService.create,
    onSuccess: (_, variables) => {
      if (variables.transportId) {
        queryClient.invalidateQueries({
          queryKey: ['transportContacts', variables.transportId]
        });
      }
    }
  });
};

export const useUpdateTransportContact = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TransportContact> }) =>
      TransportContactService.update(id, data),
    onSuccess: (_, variables) => {
      if (variables.data.transportId) {
        queryClient.invalidateQueries({
          queryKey: ['transportContacts', variables.data.transportId]
        });
      }
      queryClient.invalidateQueries({
        queryKey: ['transportContact', variables.id]
      });
    }
  });
};

export const useDeleteTransportContact = (transportId?: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: TransportContactService.delete,
    onSuccess: () => {
      if (transportId) {
        queryClient.invalidateQueries({
          queryKey: ['transportContacts', transportId]
        });
      }
    }
  });
};
