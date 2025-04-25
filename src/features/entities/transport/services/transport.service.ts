
import { supabase } from '@/integrations/supabase/client';
import { Transport } from '../models/transport.model';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const getTransports = async (): Promise<Transport[]> => {
  const { data, error } = await supabase.from('transportes').select('*');
  
  if (error) throw new Error(error.message);
  
  return data.map(item => ({
    id: item.id.toString(),
    razon_social: item.razon_social || '',
    ruc: item.ruc || '',
    direccion: item.direccion || '',
    cobertura: item.cobertura || '',
    estado: item.estado ?? true,
    departamento: item.departamento || '',
    provincia: item.provincia || '',
    distrito: item.distrito || '',
    createdAt: item.created_at,
    updatedAt: item.updated_at
  }));
};

export const getTransport = async (id: string): Promise<Transport> => {
  const { data, error } = await supabase
    .from('transportes')
    .select('*')
    .eq('id', parseInt(id, 10))
    .single();
  
  if (error) throw new Error(error.message);
  
  return {
    id: data.id.toString(),
    razon_social: data.razon_social || '',
    ruc: data.ruc || '',
    direccion: data.direccion || '',
    cobertura: data.cobertura || '',
    estado: data.estado ?? true,
    departamento: data.departamento || '',
    provincia: data.provincia || '',
    distrito: data.distrito || '',
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

export const createTransport = async (transport: Omit<Transport, 'id'>): Promise<Transport> => {
  const { data, error } = await supabase
    .from('transportes')
    .insert({
      razon_social: transport.razon_social,
      ruc: transport.ruc,
      direccion: transport.direccion,
      cobertura: transport.cobertura,
      estado: transport.estado,
      departamento: transport.departamento,
      provincia: transport.provincia,
      distrito: transport.distrito
    })
    .select()
    .single();
  
  if (error) throw new Error(error.message);
  
  return {
    id: data.id.toString(),
    razon_social: data.razon_social || '',
    ruc: data.ruc || '',
    direccion: data.direccion || '',
    cobertura: data.cobertura || '',
    estado: data.estado ?? true,
    departamento: data.departamento || '',
    provincia: data.provincia || '',
    distrito: data.distrito || '',
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

export const updateTransport = async ({ id, data }: { id: string, data: Partial<Transport> }): Promise<Transport> => {
  const { data: updatedData, error } = await supabase
    .from('transportes')
    .update({
      razon_social: data.razon_social,
      ruc: data.ruc,
      direccion: data.direccion,
      cobertura: data.cobertura,
      estado: data.estado,
      departamento: data.departamento,
      provincia: data.provincia,
      distrito: data.distrito
    })
    .eq('id', parseInt(id, 10))
    .select()
    .single();
  
  if (error) throw new Error(error.message);
  
  return {
    id: updatedData.id.toString(),
    razon_social: updatedData.razon_social || '',
    ruc: updatedData.ruc || '',
    direccion: updatedData.direccion || '',
    cobertura: updatedData.cobertura || '',
    estado: updatedData.estado ?? true,
    departamento: updatedData.departamento || '',
    provincia: updatedData.provincia || '',
    distrito: updatedData.distrito || '',
    createdAt: updatedData.created_at,
    updatedAt: updatedData.updated_at
  };
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
