
import { supabase } from '@/integrations/supabase/client';
import { Client, ClientContact, ClientDB, ContactoClienteDB, mapClientFromDB, mapClientToDB, mapContactFromDB, mapContactToDB } from '../models/client.model';

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
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return mapClientFromDB(data);
  }

  async createClient(client: Partial<Client>): Promise<Client> {
    const { data, error } = await supabase
      .from('clientes')
      .insert([mapClientToDB(client)])
      .select()
      .single();
      
    if (error) throw error;
    return mapClientFromDB(data);
  }

  async updateClient(id: string, client: Partial<Client>): Promise<Client> {
    const { data, error } = await supabase
      .from('clientes')
      .update(mapClientToDB(client))
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return mapClientFromDB(data);
  }

  async deleteClient(id: string): Promise<void> {
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  }

  // Contact methods
  async fetchClientContacts(clientId: string): Promise<ClientContact[]> {
    const { data, error } = await supabase
      .from('contacto_clientes')
      .select('*')
      .eq('cliente_id', clientId)
      .order('nombre');
      
    if (error) throw error;
    return (data || []).map(mapContactFromDB);
  }

  async createContact(contact: Partial<ClientContact>): Promise<ClientContact> {
    const { data, error } = await supabase
      .from('contacto_clientes')
      .insert([mapContactToDB(contact)])
      .select()
      .single();
      
    if (error) throw error;
    return mapContactFromDB(data);
  }

  async updateContact(id: string, contact: Partial<ClientContact>): Promise<ClientContact> {
    const { data, error } = await supabase
      .from('contacto_clientes')
      .update(mapContactToDB(contact))
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return mapContactFromDB(data);
  }

  async deleteContact(id: string): Promise<void> {
    const { error } = await supabase
      .from('contacto_clientes')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  }
}

export const clientService = new ClientService();

