
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clienteApi } from "./api/clienteApi";
import { Cliente, ContactoCliente } from "../models/client.model";

/**
 * Cliente Service
 * Hooks de React Query para la gestión de clientes y sus contactos
 */

export const clienteService = {
  ...clienteApi,
};

/**
 * Hook para obtener todos los clientes
 */
export const useClientes = () => {
  return useQuery({
    queryKey: ["clientes"],
    queryFn: clienteService.fetchClientes,
  });
};

/**
 * Hook para obtener un cliente por su ID
 */
export const useCliente = (id: string) => {
  return useQuery({
    queryKey: ["cliente", id],
    queryFn: () => clienteService.fetchClienteById(id),
    enabled: !!id,
  });
};

/**
 * Hook para crear un cliente
 */
export const useCreateCliente = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (clienteData: Partial<Cliente>) => 
      clienteService.createCliente(clienteData),
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
    mutationFn: ({ id, data }: { id: string; data: Partial<Cliente> }) => 
      clienteService.updateCliente(id, data),
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
    mutationFn: (id: string) => clienteService.deleteCliente(id),
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
    queryFn: () => clienteService.fetchContactosCliente(clienteId),
    enabled: !!clienteId,
  });
};

/**
 * Hook para crear un contacto de cliente
 */
export const useCreateContactoCliente = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (contactoData: Partial<ContactoCliente>) => 
      clienteService.createContactoCliente(contactoData),
    onSuccess: (_, variables) => {
      if (variables.clienteId) {
        queryClient.invalidateQueries({ 
          queryKey: ["contactosCliente", variables.clienteId] 
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
    mutationFn: ({ id, data }: { id: string; data: Partial<ContactoCliente> }) => 
      clienteService.updateContactoCliente(id, data),
    onSuccess: (_, variables) => {
      if (variables.data.clienteId) {
        queryClient.invalidateQueries({ 
          queryKey: ["contactosCliente", variables.data.clienteId] 
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
    mutationFn: (id: string) => clienteService.deleteContactoCliente(id),
    onSuccess: () => {
      if (clienteId) {
        queryClient.invalidateQueries({ 
          queryKey: ["contactosCliente", clienteId] 
        });
      }
    },
  });
};
