
import { supabase } from '@/integrations/supabase/client';
import { Transport, TransportDB, mapTransportFromDB, mapTransportToDB } from '../models/transport.model';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

// Core service functions
export const transportService = {
  // Fetch all transports
  fetchTransports: async (): Promise<Transport[]> => {
    const { data, error } = await supabase
      .from('transportes')
      .select('*')
      .order('razon_social', { ascending: true });
    
    if (error) throw new Error(error.message);
    
    return (data as TransportDB[]).map(mapTransportFromDB);
  },
  
  // Fetch a single transport by ID
  fetchTransportById: async (id: string): Promise<Transport> => {
    const { data, error } = await supabase
      .from('transportes')
      .select('*')
      .eq('id', parseInt(id)) // Convert string ID to number for database query
      .single();
    
    if (error) throw new Error(error.message);
    if (!data) throw new Error('Transport not found');
    
    return mapTransportFromDB(data as TransportDB);
  },
  
  // Create a new transport
  createTransport: async (transport: Omit<Transport, 'id'>): Promise<Transport> => {
    const mappedData = mapTransportToDB(transport);
    
    const { data, error } = await supabase
      .from('transportes')
      .insert(mappedData)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    if (!data) throw new Error('Failed to create transport');
    
    return mapTransportFromDB(data as TransportDB);
  },
  
  // Update an existing transport
  updateTransport: async (id: string, transport: Partial<Transport>): Promise<Transport> => {
    const mappedData = mapTransportToDB(transport);
    
    const { data, error } = await supabase
      .from('transportes')
      .update(mappedData)
      .eq('id', parseInt(id)) // Convert string ID to number for database query
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    if (!data) throw new Error('Transport not found');
    
    return mapTransportFromDB(data as TransportDB);
  },
  
  // Delete a transport
  deleteTransport: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('transportes')
      .delete()
      .eq('id', parseInt(id)); // Convert string ID to number for database query
    
    if (error) throw new Error(error.message);
  }
};

// React hooks for the transport domain
export const useTransports = () => {
  return useQuery({
    queryKey: ['transports'],
    queryFn: transportService.fetchTransports
  });
};

export const useTransport = (id: string) => {
  return useQuery({
    queryKey: ['transports', id],
    queryFn: () => transportService.fetchTransportById(id),
    enabled: !!id
  });
};

export const useCreateTransport = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: transportService.createTransport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transports'] });
      toast({
        title: "Transporte creado",
        description: "El transporte ha sido creado exitosamente"
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudo crear el transporte: ${error.message}`
      });
    }
  });
};

export const useUpdateTransport = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Transport> }) =>
      transportService.updateTransport(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['transports'] });
      queryClient.invalidateQueries({ queryKey: ['transports', variables.id] });
      toast({
        title: "Transporte actualizado",
        description: "El transporte ha sido actualizado exitosamente"
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudo actualizar el transporte: ${error.message}`
      });
    }
  });
};

export const useDeleteTransport = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: transportService.deleteTransport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transports'] });
      toast({
        title: "Transporte eliminado",
        description: "El transporte ha sido eliminado exitosamente"
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudo eliminar el transporte: ${error.message}`
      });
    }
  });
};
