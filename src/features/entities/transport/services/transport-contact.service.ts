
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TransportContact } from '../models/transport.model';
import { supabase } from '@/integrations/supabase/client';

// Fetch transport contacts
export const useTransportContacts = (transportId: string) => {
  return useQuery({
    queryKey: ['transport-contacts', transportId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contacto_transportes')
        .select('*')
        .eq('transporte_id', transportId);
        
      if (error) throw new Error(error.message);
      return data as TransportContact[];
    },
    enabled: !!transportId,
  });
};

// Create transport contact
export const useCreateTransportContact = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (contact: Omit<TransportContact, 'id'>) => {
      const { data, error } = await supabase
        .from('contacto_transportes')
        .insert(contact)
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      return data as TransportContact;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['transport-contacts', variables.transporte_id],
      });
    },
  });
};

// Update transport contact
export const useUpdateTransportContact = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...contact }: TransportContact) => {
      const { data, error } = await supabase
        .from('contacto_transportes')
        .update(contact)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      return data as TransportContact;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['transport-contacts', variables.transporte_id],
      });
    },
  });
};

// Delete transport contact
export const useDeleteTransportContact = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (contact: TransportContact) => {
      const { error } = await supabase
        .from('contacto_transportes')
        .delete()
        .eq('id', contact.id);
        
      if (error) throw new Error(error.message);
      return contact;
    },
    onSuccess: (deletedContact) => {
      queryClient.invalidateQueries({
        queryKey: ['transport-contacts', deletedContact.transporte_id],
      });
    },
  });
};
