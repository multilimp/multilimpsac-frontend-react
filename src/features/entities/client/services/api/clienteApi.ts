
import { supabase } from '@/integrations/supabase/client';
import { Client, ClientContact, ClientDB, ContactoClienteDB, mapClientFromDB, mapClientToDB, mapContactFromDB, mapContactToDB } from '../../models/client.model';
import { stringToNumberId } from '@/utils/id-conversions';

class ClienteApi {
  /**
   * Obtiene todos los clientes
   */
  async fetchClientes(): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('razon_social');
      
    if (error) throw error;
    return (data || []).map(mapClientFromDB);
  }
  
  /**
   * Obtiene un cliente por su ID
   */
  async fetchClienteById(id: string): Promise<Client> {
    const numericId = stringToNumberId(id);
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', numericId)
      .single();
      
    if (error) throw error;
    return mapClientFromDB(data);
  }
  
  /**
   * Crea un nuevo cliente
   */
  async createCliente(cliente: Partial<Client>): Promise<Client> {
    const dbCliente = mapClientToDB(cliente);
    
    // Ensure the required fields are present
    if (!dbCliente.razon_social || !dbCliente.ruc || !dbCliente.cod_unidad) {
      throw new Error('Required fields missing: razon_social, ruc, and cod_unidad are required');
    }
    
    const { data, error } = await supabase
      .from('clientes')
      .insert(dbCliente)
      .select()
      .single();
      
    if (error) throw error;
    return mapClientFromDB(data);
  }
  
  /**
   * Actualiza un cliente
   */
  async updateCliente(id: string, cliente: Partial<Client>): Promise<Client> {
    const numericId = stringToNumberId(id);
    const dbCliente = mapClientToDB(cliente);
    
    const { data, error } = await supabase
      .from('clientes')
      .update(dbCliente)
      .eq('id', numericId)
      .select()
      .single();
      
    if (error) throw error;
    return mapClientFromDB(data);
  }
  
  /**
   * Elimina un cliente
   */
  async deleteCliente(id: string): Promise<void> {
    const numericId = stringToNumberId(id);
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', numericId);
      
    if (error) throw error;
  }
  
  /**
   * Obtiene los contactos de un cliente
   */
  async fetchContactosCliente(clienteId: string): Promise<ClientContact[]> {
    const numericClienteId = stringToNumberId(clienteId);
    const { data, error } = await supabase
      .from('contacto_clientes')
      .select('*')
      .eq('cliente_id', numericClienteId)
      .order('nombre');
      
    if (error) throw error;
    return (data || []).map(mapContactFromDB);
  }
  
  /**
   * Crea un contacto para un cliente
   */
  async createContactoCliente(contacto: Partial<ClientContact>): Promise<ClientContact> {
    const dbContacto = mapContactToDB(contacto);
    
    const { data, error } = await supabase
      .from('contacto_clientes')
      .insert(dbContacto)
      .select()
      .single();
      
    if (error) throw error;
    return mapContactFromDB(data);
  }
  
  /**
   * Actualiza un contacto
   */
  async updateContactoCliente(id: string, contacto: Partial<ClientContact>): Promise<ClientContact> {
    const numericId = stringToNumberId(id);
    const dbContacto = mapContactToDB(contacto);
    
    const { data, error } = await supabase
      .from('contacto_clientes')
      .update(dbContacto)
      .eq('id', numericId)
      .select()
      .single();
      
    if (error) throw error;
    return mapContactFromDB(data);
  }
  
  /**
   * Elimina un contacto
   */
  async deleteContactoCliente(id: string): Promise<void> {
    const numericId = stringToNumberId(id);
    const { error } = await supabase
      .from('contacto_clientes')
      .delete()
      .eq('id', numericId);
      
    if (error) throw error;
  }
}

export const clienteApi = new ClienteApi();
