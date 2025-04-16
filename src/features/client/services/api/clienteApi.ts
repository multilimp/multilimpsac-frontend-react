import { supabase } from '@/integrations/supabase/client';
import { 
  Cliente, 
  ClienteDB, 
  ContactoCliente, 
  ContactoClienteDB, 
  mapClienteFromDB, 
  mapClienteToDB,
  mapContactoClienteFromDB,
  mapContactoClienteToDB
} from '../models/client.model';

/**
 * Servicios de API para clientes
 */
export const clienteApi = {
  /**
   * Obtiene todos los clientes
   */
  fetchClientes: async (): Promise<Cliente[]> => {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('razon_social', { ascending: true });

    if (error) {
      console.error('Error al obtener clientes:', error);
      throw new Error(`No se pudieron obtener los clientes: ${error.message}`);
    }

    return (data as ClienteDB[]).map(mapClienteFromDB);
  },

  /**
   * Obtiene un cliente por su ID
   */
  fetchClienteById: async (id: string): Promise<Cliente> => {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error al obtener el cliente con ID ${id}:`, error);
      throw new Error(`No se pudo obtener el cliente: ${error.message}`);
    }

    return mapClienteFromDB(data as ClienteDB);
  },

  /**
   * Crea un nuevo cliente
   */
  createCliente: async (clienteData: Partial<Cliente>): Promise<Cliente> => {
    const clienteDB = mapClienteToDB(clienteData);
    
    const { data, error } = await supabase
      .from('clientes')
      .insert([clienteDB])
      .select()
      .single();

    if (error) {
      console.error('Error al crear el cliente:', error);
      throw new Error(`No se pudo crear el cliente: ${error.message}`);
    }

    return mapClienteFromDB(data as ClienteDB);
  },

  /**
   * Actualiza un cliente existente
   */
  updateCliente: async (id: string, clienteData: Partial<Cliente>): Promise<Cliente> => {
    const clienteDB = mapClienteToDB(clienteData);
    
    const { data, error } = await supabase
      .from('clientes')
      .update(clienteDB)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error al actualizar el cliente con ID ${id}:`, error);
      throw new Error(`No se pudo actualizar el cliente: ${error.message}`);
    }

    return mapClienteFromDB(data as ClienteDB);
  },

  /**
   * Elimina un cliente (actualiza su estado a inactivo)
   */
  deleteCliente: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('clientes')
      .update({ estado: false })
      .eq('id', id);

    if (error) {
      console.error(`Error al eliminar el cliente con ID ${id}:`, error);
      throw new Error(`No se pudo eliminar el cliente: ${error.message}`);
    }
  },

  /**
   * Obtiene todos los contactos de un cliente
   */
  fetchContactosCliente: async (clienteId: string): Promise<ContactoCliente[]> => {
    const { data, error } = await supabase
      .from('contacto_clientes')
      .select('*')
      .eq('cliente_id', clienteId)
      .eq('estado', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error al obtener los contactos del cliente con ID ${clienteId}:`, error);
      throw new Error(`No se pudieron obtener los contactos del cliente: ${error.message}`);
    }

    return (data as ContactoClienteDB[]).map(mapContactoClienteFromDB);
  },

  /**
   * Crea un nuevo contacto para un cliente
   */
  createContactoCliente: async (contactoData: Partial<ContactoCliente>): Promise<ContactoCliente> => {
    const contactoDB = mapContactoClienteToDB(contactoData);
    
    const { data, error } = await supabase
      .from('contacto_clientes')
      .insert([contactoDB])
      .select()
      .single();

    if (error) {
      console.error('Error al crear el contacto:', error);
      throw new Error(`No se pudo crear el contacto: ${error.message}`);
    }

    return mapContactoClienteFromDB(data as ContactoClienteDB);
  },

  /**
   * Actualiza un contacto existente
   */
  updateContactoCliente: async (id: string, contactoData: Partial<ContactoCliente>): Promise<ContactoCliente> => {
    const contactoDB = mapContactoClienteToDB(contactoData);
    
    const { data, error } = await supabase
      .from('contacto_clientes')
      .update(contactoDB)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error al actualizar el contacto con ID ${id}:`, error);
      throw new Error(`No se pudo actualizar el contacto: ${error.message}`);
    }

    return mapContactoClienteFromDB(data as ContactoClienteDB);
  },

  /**
   * Elimina un contacto (actualiza su estado a inactivo)
   */
  deleteContactoCliente: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('contacto_clientes')
      .update({ estado: false })
      .eq('id', id);

    if (error) {
      console.error(`Error al eliminar el contacto con ID ${id}:`, error);
      throw new Error(`No se pudo eliminar el contacto: ${error.message}`);
    }
  }
};