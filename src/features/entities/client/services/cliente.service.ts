
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Client, ClientContact, normalizeClientContact } from '../models/client.model';
import { clienteApi } from './api/clienteApi';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook para obtener todos los clientes
 */
export const useClientes = () => {
  return useQuery({
    queryKey: ['clientes'],
    queryFn: clienteApi.fetchClientes.bind(clienteApi)
  });
};

/**
 * Hook para obtener un cliente por su ID
 */
export const useCliente = (id: string) => {
  return useQuery({
    queryKey: ['cliente', id],
    queryFn: () => clienteApi.fetchClienteById(id),
    enabled: !!id
  });
};

/**
 * Hook para crear un cliente
 */
export const useCreateCliente = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (cliente: Partial<Client>) => 
      clienteApi.createCliente(cliente),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
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

/**
 * Hook para actualizar un cliente
 */
export const useUpdateCliente = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Client> }) =>
      clienteApi.updateCliente(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      queryClient.invalidateQueries({ queryKey: ['cliente', variables.id] });
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

/**
 * Hook para eliminar un cliente
 */
export const useDeleteCliente = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: clienteApi.deleteCliente.bind(clienteApi),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
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

/**
 * Hook para obtener los contactos de un cliente
 */
export const useContactosCliente = (clienteId: string) => {
  return useQuery({
    queryKey: ['contactosCliente', clienteId],
    queryFn: () => clienteId ? clienteApi.fetchContactosCliente(clienteId) : [],
    enabled: !!clienteId
  });
};

/**
 * Hook para crear un contacto de cliente
 */
export const useCreateContactoCliente = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (contacto: Partial<ClientContact>) => {
      const normalized = normalizeClientContact(contacto);
      return clienteApi.createContactoCliente(normalized);
    },
    onSuccess: (_, variables) => {
      const normalized = normalizeClientContact(variables);
      if (normalized.clientId) {
        queryClient.invalidateQueries({ 
          queryKey: ['contactosCliente', normalized.clientId] 
        });
      }
      toast({
        title: "Contacto creado",
        description: "El contacto ha sido creado exitosamente"
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudo crear el contacto: ${error.message}`
      });
    }
  });
};

/**
 * Hook para actualizar un contacto de cliente
 */
export const useUpdateContactoCliente = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ClientContact> }) => {
      const normalized = normalizeClientContact(data);
      return clienteApi.updateContactoCliente(id, normalized);
    },
    onSuccess: (_, variables) => {
      const normalized = normalizeClientContact(variables.data);
      if (normalized.clientId) {
        queryClient.invalidateQueries({ 
          queryKey: ['contactosCliente', normalized.clientId] 
        });
      }
      toast({
        title: "Contacto actualizado",
        description: "El contacto ha sido actualizado exitosamente"
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudo actualizar el contacto: ${error.message}`
      });
    }
  });
};

/**
 * Hook para eliminar un contacto de cliente
 */
export const useDeleteContactoCliente = (clienteId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: clienteApi.deleteContactoCliente.bind(clienteApi),
    onSuccess: () => {
      if (clienteId) {
        queryClient.invalidateQueries({ 
          queryKey: ['contactosCliente', clienteId] 
        });
      }
      toast({
        title: "Contacto eliminado",
        description: "El contacto ha sido eliminado exitosamente"
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudo eliminar el contacto: ${error.message}`
      });
    }
  });
};
