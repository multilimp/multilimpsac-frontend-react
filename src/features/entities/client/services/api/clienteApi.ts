
import { supabase } from '@/integrations/supabase/client';
import { 
  Client, 
  ClientDB, 
  ClientContact, 
  ContactoClienteDB, 
  mapClientFromDB, 
  mapClientToDB, 
  mapContactFromDB, 
  mapContactToDB 
} from '../../models/client.model';
import { stringToNumberId } from '@/utils/id-conversions';

// Create a class with correct implementation for Supabase operations
class ClienteApi {
  async fetchClientes(): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('razon_social');
      
    if (error) throw error;
    return (data || []).map(mapClientFromDB);
  }

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

  async createCliente(client: Partial<Client>): Promise<Client> {
    const dbClient = mapClientToDB(client);
    
    // Ensure the required fields are present for Supabase insert
    const clienteData = {
      razon_social: dbClient.razon_social || 'Nuevo cliente',
      ruc: dbClient.ruc || '00000000000',
      cod_unidad: dbClient.cod_unidad || 'DEFAULT',
      estado: dbClient.estado !== undefined ? dbClient.estado : true,
      ...dbClient
    };
    
    const { data, error } = await supabase
      .from('clientes')
      .insert(clienteData)
      .select()
      .single();
      
    if (error) throw error;
    return mapClientFromDB(data);
  }

  async updateCliente(id: string, client: Partial<Client>): Promise<Client> {
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
  }

  async deleteCliente(id: string): Promise<void> {
    const numericId = stringToNumberId(id);
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', numericId);
      
    if (error) throw error;
  }

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

  async createContactoCliente(contact: Partial<ClientContact>): Promise<ClientContact> {
    const dbContact = mapContactToDB(contact);
    
    const { data, error } = await supabase
      .from('contacto_clientes')
      .insert(dbContact)
      .select()
      .single();
      
    if (error) throw error;
    return mapContactFromDB(data);
  }

  async updateContactoCliente(id: string, contact: Partial<ClientContact>): Promise<ClientContact> {
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
  }

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
