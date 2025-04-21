
import { supabase } from '@/integrations/supabase/client';
import { Client, ClientContact, ClientFormInput } from '../models/client.model';

class ClientService {
  async fetchClients(): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('name');
      
    if (error) throw error;
    return data || [];
  }

  async fetchClientById(id: string): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  }

  async createClient(client: ClientFormInput): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .insert([client])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }

  async updateClient(id: string, client: Partial<ClientFormInput>): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .update(client)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }

  async deleteClient(id: string): Promise<void> {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  }

  // Contact methods
  async fetchClientContacts(clientId: string): Promise<ClientContact[]> {
    const { data, error } = await supabase
      .from('client_contacts')
      .select('*')
      .eq('client_id', clientId)
      .order('name');
      
    if (error) throw error;
    return data || [];
  }
}

export const clientService = new ClientService();
