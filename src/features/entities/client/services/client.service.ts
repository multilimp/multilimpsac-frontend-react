
import { supabase } from '@/integrations/supabase/client';
import { Client, ClientContact, ClientDB, ContactoClienteDB, mapClientFromDB, mapClientToDB, mapContactFromDB, mapContactToDB } from '../models/client.model';
import { stringToNumberId } from '@/utils/id-conversions';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Cliente Service
export const fetchClientes = async (): Promise<Client[]> => {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .order('razon_social');
    
  if (error) throw error;
  return (data || []).map(mapClientFromDB);
};

export const fetchClienteById = async (id: string): Promise<Client> => {
  const numericId = stringToNumberId(id);
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('id', numericId)
    .single();
    
  if (error) throw error;
  return mapClientFromDB(data);
};

export const createCliente = async (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> => {
  const dbClient = mapClientToDB(client);
  
  // Ensure the required fields are present
  if (!dbClient.razon_social || !dbClient.ruc || !dbClient.cod_unidad) {
    throw new Error('Required fields missing: razon_social, ruc, and cod_unidad are required');
  }
  
  const clientData = {
    razon_social: dbClient.razon_social,
    ruc: dbClient.ruc,
    cod_unidad: dbClient.cod_unidad,
    direccion: dbClient.direccion,
    departamento: dbClient.departamento,
    provincia: dbClient.provincia,
    distrito: dbClient.distrito,
    estado: dbClient.estado !== undefined ? dbClient.estado : true,
  };
  
  const { data, error } = await supabase
    .from('clientes')
    .insert(clientData)
    .select()
    .single();
    
  if (error) throw error;
  return mapClientFromDB(data);
};

export const updateCliente = async (id: string, client: Partial<Client>): Promise<Client> => {
  const numericId = stringToNumberId(id);
  const dbClient = mapClientToDB(client);
  
  const { data, error } = await supabase
    .from('clientes')
    .update(dbClient)
    .eq('id', numericId)
    .select()
    .single();
    
  if (error) throw error;
  return mapClientFromDB(data);
};

export const deleteCliente = async (id: string): Promise<void> => {
  const numericId = stringToNumberId(id);
  const { error } = await supabase
    .from('clientes')
    .delete()
    .eq('id', numericId);
    
  if (error) throw error;
};

// ContactoCliente Service
export const fetchContactosCliente = async (clienteId: string): Promise<ClientContact[]> => {
  const numericClienteId = stringToNumberId(clienteId);
  const { data, error } = await supabase
    .from('contacto_clientes')
    .select('*')
    .eq('cliente_id', numericClienteId)
    .order('nombre');
    
  if (error) throw error;
  return (data || []).map(mapContactFromDB);
};

export const createContactoCliente = async (contact: Partial<ClientContact>): Promise<ClientContact> => {
  const dbContact = mapContactToDB(contact);
  
  const { data, error } = await supabase
    .from('contacto_clientes')
    .insert(dbContact)
    .select()
    .single();
    
  if (error) throw error;
  return mapContactFromDB(data);
};

export const updateContactoCliente = async (id: string, contact: Partial<ClientContact>): Promise<ClientContact> => {
  const numericId = stringToNumberId(id);
  const dbContact = mapContactToDB(contact);
  
  const { data, error } = await supabase
    .from('contacto_clientes')
    .update(dbContact)
    .eq('id', numericId)
    .select()
    .single();
    
  if (error) throw error;
  return mapContactFromDB(data);
};

export const deleteContactoCliente = async (id: string): Promise<void> => {
  const numericId = stringToNumberId(id);
  const { error } = await supabase
    .from('contacto_clientes')
    .delete()
    .eq('id', numericId);
    
  if (error) throw error;
};

// React Query Hooks
export const useClientes = () => {
  return useQuery({
    queryKey: ['clientes'],
    queryFn: fetchClientes
  });
};

export const useCliente = (id: string | undefined) => {
  return useQuery({
    queryKey: ['clientes', id],
    queryFn: () => fetchClienteById(id!),
    enabled: !!id
  });
};

export const useCreateCliente = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createCliente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    }
  });
};

export const useUpdateCliente = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Client> }) => 
      updateCliente(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      queryClient.invalidateQueries({ queryKey: ['clientes', variables.id] });
    }
  });
};

export const useDeleteCliente = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteCliente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    }
  });
};

export const useContactosCliente = (clienteId: string | undefined) => {
  return useQuery({
    queryKey: ['contactos', clienteId],
    queryFn: () => fetchContactosCliente(clienteId!),
    enabled: !!clienteId
  });
};

export const useCreateContactoCliente = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createContactoCliente,
    onSuccess: (_, variables) => {
      if (variables.clientId) {
        queryClient.invalidateQueries({ queryKey: ['contactos', variables.clientId] });
      }
    }
  });
};

export const useUpdateContactoCliente = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ClientContact> }) =>
      updateContactoCliente(id, data),
    onSuccess: (_, variables) => {
      if (variables.data.clientId) {
        queryClient.invalidateQueries({ queryKey: ['contactos', variables.data.clientId] });
      }
    }
  });
};

export const useDeleteContactoCliente = (clienteId?: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteContactoCliente,
    onSuccess: () => {
      if (clienteId) {
        queryClient.invalidateQueries({ queryKey: ['contactos', clienteId] });
      }
    }
  });
};
