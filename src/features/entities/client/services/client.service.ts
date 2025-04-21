
import { supabase } from '@/integrations/supabase/client';
import { Client, ClientContact, ClientDB, ContactoClienteDB, mapClientFromDB, mapClientToDB, mapContactFromDB, mapContactToDB } from '../models/client.model';
import { stringToNumberId } from '@/utils/id-conversions';

class ClientService {
  async fetchClients(): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('razon_social');
      
    if (error) throw error;
    return (data || []).map(mapClientFromDB);
  }

  async fetchClientById(id: string): Promise<Client> {
    const numericId = stringToNumberId(id);
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', numericId)
      .single();
      
    if (error) throw error;
    return mapClientFromDB(data);
  }

  async createClient(client: Partial<Client>): Promise<Client> {
    const dbClient = mapClientToDB(client);
    
    // Ensure the required fields are present
    if (!dbClient.razon_social || !dbClient.ruc || !dbClient.cod_unidad) {
      throw new Error('Required fields missing: razon_social, ruc, and cod_unidad are required');
    }
    
    const { data, error } = await supabase
      .from('clientes')
      .insert([dbClient]) // Wrap in array for Supabase
      .select()
      .single();
      
    if (error) throw error;
    return mapClientFromDB(data);
  }

  async updateClient(id: string, client: Partial<Client>): Promise<Client> {
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

  async deleteClient(id: string): Promise<void> {
    const numericId = stringToNumberId(id);
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', numericId);
      
    if (error) throw error;
  }

  async fetchClientContacts(clientId: string): Promise<ClientContact[]> {
    const numericClientId = stringToNumberId(clientId);
    const { data, error } = await supabase
      .from('contacto_clientes')
      .select('*')
      .eq('cliente_id', numericClientId)
      .order('nombre');
      
    if (error) throw error;
    return (data || []).map(mapContactFromDB);
  }

  async createContact(contact: Partial<ClientContact>): Promise<ClientContact> {
    const dbContact = mapContactToDB(contact);
    
    const { data, error } = await supabase
      .from('contacto_clientes')
      .insert([dbContact]) // Wrap in array for Supabase
      .select()
      .single();
      
    if (error) throw error;
    return mapContactFromDB(data);
  }

  async updateContact(id: string, contact: Partial<ClientContact>): Promise<ClientContact> {
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

  async deleteContact(id: string): Promise<void> {
    const numericId = stringToNumberId(id);
    const { error } = await supabase
      .from('contacto_clientes')
      .delete()
      .eq('id', numericId);
      
    if (error) throw error;
  }
}

export const clientService = new ClientService();
