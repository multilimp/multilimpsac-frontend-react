import { supabase } from '@/integrations/supabase/client';
import { Client, ClientDB, mapClientFromDB, mapClientToDB } from '../models/client.model';

export class ClientService {
  static async createClient(client: Partial<Client>): Promise<Client> {
    const data = mapClientToDB(client as Client);
    const required = {
      ruc: data.ruc || '',
      razon_social: data.razon_social || '',
      cod_unidad: data.cod_unidad || '',
      estado: true
    };

    const { data: newClient, error } = await supabase
      .from('clientes')
      .insert({ ...data, ...required })
      .select()
      .single();

    if (error) throw error;
    return mapClientFromDB(newClient);
  }

  static async fetchClients(): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('razon_social', { ascending: true });

    if (error) {
      console.error('Error fetching clients:', error);
      throw new Error(error.message);
    }

    return (data || []).map(mapClientFromDB);
  }

  static async fetchClientById(id: string): Promise<Client> {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching client with ID ${id}:`, error);
      throw new Error(error.message);
    }

    return mapClientFromDB(data);
  }

  static async updateClient(id: string, client: Partial<Client>): Promise<Client> {
    const data = mapClientToDB(client as Client);

    const { data: updatedClient, error } = await supabase
      .from('clientes')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating client with ID ${id}:`, error);
      throw new Error(error.message);
    }

    return mapClientFromDB(updatedClient);
  }

  static async deleteClient(id: string): Promise<void> {
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting client with ID ${id}:`, error);
      throw new Error(error.message);
    }
  }

  static async fetchClientContacts(clientId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('contacto_clientes')
      .select('*')
      .eq('cliente_id', clientId);

    if (error) {
      console.error(`Error fetching contacts for client ID ${clientId}:`, error);
      throw new Error(error.message);
    }

    return data || [];
  }

  static async createContact(contact: any): Promise<any> {
    const { data, error } = await supabase
      .from('contacto_clientes')
      .insert(contact)
      .select()
      .single();

    if (error) {
      console.error('Error creating contact:', error);
      throw new Error(error.message);
    }

    return data;
  }

  static async updateContact(id: string, contact: any): Promise<any> {
    const { data, error } = await supabase
      .from('contacto_clientes')
      .update(contact)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating contact with ID ${id}:`, error);
      throw new Error(error.message);
    }

    return data;
  }

  static async deleteContact(id: string): Promise<void> {
    const { error } = await supabase
      .from('contacto_clientes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting contact with ID ${id}:`, error);
      throw new Error(error.message);
    }
  }
}
