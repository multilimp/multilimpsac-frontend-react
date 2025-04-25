
import { supabase } from '@/integrations/supabase/client';
import { Transport, TransportDB, mapTransportFromDB, mapTransportToDB } from '../models/transport.model';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const getTransports = async (): Promise<Transport[]> => {
  const { data, error } = await supabase.from('transportes').select('*');
  
  if (error) throw new Error(error.message);
  
  return (data as TransportDB[]).map(mapTransportFromDB);
};

export const getTransport = async (id: string): Promise<Transport> => {
  const { data, error } = await supabase
    .from('transportes')
    .select('*')
    .eq('id', parseInt(id, 10))
    .single();
  
  if (error) throw new Error(error.message);
  
  return mapTransportFromDB(data as TransportDB);
};

export const createTransport = async (transport: Omit<Transport, 'id'>): Promise<Transport> => {
  const transportData = mapTransportToDB(transport);
  
  const { data, error } = await supabase
    .from('transportes')
    .insert(transportData)
    .select()
    .single();
  
  if (error) throw new Error(error.message);
  
  return mapTransportFromDB(data as TransportDB);
};

export const updateTransport = async ({ id, data }: { id: string, data: Partial<Transport> }): Promise<Transport> => {
  const transportData = mapTransportToDB(data);
  
  const { data: updatedData, error } = await supabase
    .from('transportes')
    .update(transportData)
    .eq('id', parseInt(id, 10))
    .select()
    .single();
  
  if (error) throw new Error(error.message);
  
  return mapTransportFromDB(updatedData as TransportDB);
};

export const deleteTransport = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('transportes')
    .delete()
    .eq('id', parseInt(id, 10));
  
  if (error) throw new Error(error.message);
};

// React Query hooks
export const useTransports = () => {
  return useQuery({
    queryKey: ['transports'],
    queryFn: getTransports
  });
};

export const useTransport = (id: string) => {
  return useQuery({
    queryKey: ['transport', id],
    queryFn: () => getTransport(id),
    enabled: !!id
  });
};

export const useCreateTransport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createTransport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transports'] });
    }
  });
};

export const useUpdateTransport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateTransport,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['transports'] });
      queryClient.invalidateQueries({ queryKey: ['transport', variables.id] });
    }
  });
};

export const useDeleteTransport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteTransport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transports'] });
    }
  });
};
