
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Client, ClientContact, normalizeClientContact } from "@/features/entities/client/models/client.model";
import clientService from "./client.service";

/**
 * Cliente Service
 * Hooks de React Query para la gestión de clientes y sus contactos
 */

// Define the client service object with the proper methods
export const clienteService = {
  // Reexport the methods from clientService
  getAll: clientService.getAll,
  getById: clientService.getById,
  create: clientService.create,
  update: clientService.update,
  delete: clientService.delete,
  fetchContactsById: clientService.fetchContactsById,
  createContact: clientService.createContact,
  updateContact: clientService.updateContact,
  deleteContact: clientService.deleteContact
};

/**
 * Hook para obtener todos los clientes
 */
export const useClientes = () => {
  return useQuery({
    queryKey: ["clientes"],
    queryFn: clienteService.getAll,
  });
};

/**
 * Hook para obtener un cliente por su ID
 */
export const useCliente = (id: string) => {
  return useQuery({
    queryKey: ["cliente", id],
    queryFn: () => clienteService.getById(id),
    enabled: !!id,
  });
};

/**
 * Hook para crear un cliente
 */
export const useCreateCliente = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (clienteData: Partial<Client>) => 
      clienteService.create(clienteData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
    },
  });
};

/**
 * Hook para actualizar un cliente
 */
export const useUpdateCliente = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Client> }) => 
      clienteService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      queryClient.invalidateQueries({ queryKey: ["cliente", variables.id] });
    },
  });
};

/**
 * Hook para eliminar un cliente
 */
export const useDeleteCliente = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => clienteService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
    },
  });
};

/**
 * Hook para obtener los contactos de un cliente
 */
export const useContactosCliente = (clienteId: string) => {
  return useQuery({
    queryKey: ["contactosCliente", clienteId],
    queryFn: () => clienteId ? clienteService.fetchContactsById(clienteId) : [],
    enabled: !!clienteId,
  });
};

/**
 * Hook para crear un contacto de cliente
 */
export const useCreateContactoCliente = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (contactoData: Partial<ClientContact>) => {
      const normalized = normalizeClientContact(contactoData);
      return clienteService.createContact(normalized);
    },
    onSuccess: (_, variables) => {
      const normalized = normalizeClientContact(variables);
      if (normalized.clientId) {
        queryClient.invalidateQueries({ 
          queryKey: ["contactosCliente", normalized.clientId] 
        });
      }
    },
  });
};

/**
 * Hook para actualizar un contacto de cliente
 */
export const useUpdateContactoCliente = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ClientContact> }) => {
      const normalized = normalizeClientContact(data);
      return clienteService.updateContact(id, normalized);
    },
    onSuccess: (_, variables) => {
      const normalized = normalizeClientContact(variables.data);
      if (normalized.clientId) {
        queryClient.invalidateQueries({ 
          queryKey: ["contactosCliente", normalized.clientId] 
        });
      }
    },
  });
};

/**
 * Hook para eliminar un contacto de cliente
 */
export const useDeleteContactoCliente = (clienteId?: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => clienteService.deleteContact(id),
    onSuccess: () => {
      if (clienteId) {
        queryClient.invalidateQueries({ 
          queryKey: ["contactosCliente", clienteId] 
        });
      }
    },
  });
};
