
import { supabase } from '@/integrations/supabase/client';
import { Client, ClientDB, mapClientFromDB, mapClientToDB } from '../models/client.model';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

// Core service functions
export const clientService = {
  // Fetch all clients
  fetchClients: async (): Promise<Client[]> => {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('razon_social', { ascending: true });
    
    if (error) throw new Error(error.message);
    
    return (data as ClientDB[]).map(mapClientFromDB);
  },
  
  // Fetch a single client by ID
  fetchClientById: async (id: string): Promise<Client> => {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', parseInt(id)) // Convert string ID to number for database query
      .single();
    
    if (error) throw new Error(error.message);
    if (!data) throw new Error('Client not found');
    
    return mapClientFromDB(data as ClientDB);
  },
  
  // Create a new client
  createClient: async (client: Omit<Client, 'id'>): Promise<Client> => {
    const mappedData = mapClientToDB(client);
    
    const { data, error } = await supabase
      .from('clientes')
      .insert(mappedData)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    if (!data) throw new Error('Failed to create client');
    
    return mapClientFromDB(data as ClientDB);
  },
  
  // Update an existing client
  updateClient: async (id: string, client: Partial<Client>): Promise<Client> => {
    const mappedData = mapClientToDB(client);
    
    const { data, error } = await supabase
      .from('clientes')
      .update(mappedData)
      .eq('id', parseInt(id)) // Convert string ID to number for database query
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    if (!data) throw new Error('Client not found');
    
    return mapClientFromDB(data as ClientDB);
  },
  
  // Delete a client
  deleteClient: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', parseInt(id)); // Convert string ID to number for database query
    
    if (error) throw new Error(error.message);
  }
};

// React hooks for the client domain
export const useClients = () => {
  return useQuery({
    queryKey: ['clients'],
    queryFn: clientService.fetchClients
  });
};

export const useClient = (id: string) => {
  return useQuery({
    queryKey: ['clients', id],
    queryFn: () => clientService.fetchClientById(id),
    enabled: !!id
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: clientService.createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Cliente creado",
        description: "El cliente ha sido creado exitosamente"
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudo crear el cliente: ${error.message}`
      });
    }
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Client> }) =>
      clientService.updateClient(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['clients', variables.id] });
      toast({
        title: "Cliente actualizado",
        description: "El cliente ha sido actualizado exitosamente"
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudo actualizar el cliente: ${error.message}`
      });
    }
  });
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: clientService.deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Cliente eliminado",
        description: "El cliente ha sido eliminado exitosamente"
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudo eliminar el cliente: ${error.message}`
      });
    }
  });
};
