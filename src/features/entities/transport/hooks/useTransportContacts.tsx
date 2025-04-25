
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/config/supabase';
import { TransportContact, mapTransportContactFromDB, mapTransportContactToDB } from '../models/transportContact.model';
import { stringToNumberId } from '@/utils/id-conversions';

export const useTransportContacts = (transportId: string) => {
  const queryClient = useQueryClient();

  // Fetch contacts for a transport
  const { data: contacts = [], isLoading, error } = useQuery({
    queryKey: ['transportContacts', transportId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transporte_contactos')
        .select('*')
        .eq('transporte_id', stringToNumberId(transportId))
        .order('nombre');

      if (error) throw error;
      return (data || []).map(mapTransportContactFromDB);
    },
  });

  // Create a new contact
  const createContact = useMutation({
    mutationFn: async (contact: Partial<TransportContact>): Promise<Partial<TransportContact>> => {
      const contactData = {
        ...mapTransportContactToDB(contact),
        transporte_id: stringToNumberId(transportId),
      };

      const { data, error } = await supabase
        .from('transporte_contactos')
        .insert(contactData)
        .select()
        .single();

      if (error) throw error;
      return mapTransportContactFromDB(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['transportContacts', transportId]);
    },
  });

  // Update an existing contact
  const updateContact = useMutation({
    mutationFn: async (contact: Partial<TransportContact>): Promise<Partial<TransportContact>> => {
      const { id, ...contactData } = mapTransportContactToDB(contact);

      const { data, error } = await supabase
        .from('transporte_contactos')
        .update(contactData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return mapTransportContactFromDB(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['transportContacts', transportId]);
    },
  });

  // Delete a contact
  const deleteContact = useMutation({
    mutationFn: async (contactId: string): Promise<TransportContact> => {
      const { data, error } = await supabase
        .from('transporte_contactos')
        .delete()
        .eq('id', stringToNumberId(contactId))
        .select()
        .single();

      if (error) throw error;
      return mapTransportContactFromDB(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['transportContacts', transportId]);
    },
  });

  return {
    contacts,
    isLoading,
    error,
    createContact,
    updateContact,
    deleteContact,
  };
};
