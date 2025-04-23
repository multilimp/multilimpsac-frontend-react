
import { supabase } from "@/integrations/supabase/client";
import { 
  TransportContact, 
  TransportContactDB, 
  mapTransportContactFromDB, 
  mapTransportContactToDB 
} from "../models/transport.model";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Transport Contact Service functions
export const getTransportContacts = async (transporteId: string): Promise<TransportContact[]> => {
  try {
    // Convert string ID to number if needed by the database
    const numericId = typeof transporteId === 'string' ? parseInt(transporteId, 10) : transporteId;
    
    const { data, error } = await supabase
      .from('contacto_transportes')
      .select('*')
      .eq('transporte_id', numericId);
    
    if (error) throw error;
    
    // Map database results to our model
    return (data as TransportContactDB[]).map(mapTransportContactFromDB);
  } catch (error) {
    console.error("Error fetching transport contacts:", error);
    throw error;
  }
};

export const createTransportContact = async (contacto: Omit<TransportContact, "id">): Promise<TransportContact> => {
  try {
    const contactData = mapTransportContactToDB(contacto);
    
    const { data, error } = await supabase
      .from('contacto_transportes')
      .insert(contactData)
      .select()
      .single();
    
    if (error) throw error;
    
    // Map database result to our model
    return mapTransportContactFromDB(data as TransportContactDB);
  } catch (error) {
    console.error("Error creating transport contact:", error);
    throw error;
  }
};

export const updateTransportContact = async (id: string, contacto: Partial<TransportContact>): Promise<TransportContact> => {
  try {
    // Convert string ID to number if needed by the database
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    const contactData = mapTransportContactToDB(contacto);
    
    const { data, error } = await supabase
      .from('contacto_transportes')
      .update(contactData)
      .eq('id', numericId)
      .select()
      .single();
    
    if (error) throw error;
    
    // Map database result to our model
    return mapTransportContactFromDB(data as TransportContactDB);
  } catch (error) {
    console.error("Error updating transport contact:", error);
    throw error;
  }
};

export const deleteTransportContact = async (id: string): Promise<void> => {
  try {
    // Convert string ID to number if needed by the database
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    
    const { error } = await supabase
      .from('contacto_transportes')
      .delete()
      .eq('id', numericId);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error deleting transport contact:", error);
    throw error;
  }
};

// React Query Hooks
export const useTransportContacts = (transportId?: string) => {
  return useQuery({
    queryKey: ['transportContacts', transportId],
    queryFn: () => getTransportContacts(transportId as string),
    enabled: !!transportId
  });
};

export const useCreateTransportContact = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (contact: Omit<TransportContact, 'id'>) => 
      createTransportContact(contact),
    onSuccess: (_, variables) => {
      if (variables.transporte_id) {
        queryClient.invalidateQueries({ queryKey: ['transportContacts', variables.transporte_id] });
      }
    }
  });
};

export const useUpdateTransportContact = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<TransportContact> }) => 
      updateTransportContact(id, data),
    onSuccess: (_, variables) => {
      const transportId = variables.data.transporte_id;
      if (transportId) {
        queryClient.invalidateQueries({ queryKey: ['transportContacts', transportId] });
      }
    }
  });
};

export const useDeleteTransportContact = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (contact: TransportContact) => deleteTransportContact(contact.id),
    onSuccess: (_, variables) => {
      if (variables.transporte_id) {
        queryClient.invalidateQueries({ queryKey: ['transportContacts', variables.transporte_id] });
      }
    }
  });
};
