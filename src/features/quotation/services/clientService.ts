
import { supabase } from "@/integrations/supabase/client";

export interface Client {
  id: string;
  razonSocial: string;
  ruc: string;
}

export interface ClientContact {
  id: string;
  clientId: string;
  nombre: string;
  cargo: string;
  correo: string;
  telefono: string;
}

export const clientService = {
  async getClients(): Promise<Client[]> {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('id, razon_social, ruc')
        .eq('estado', true)
        .order('razon_social');
      
      if (error) throw error;
      
      return data.map(client => ({
        id: client.id,
        razonSocial: client.razon_social,
        ruc: client.ruc
      }));
    } catch (error) {
      console.error('Error fetching clients:', error);
      return [];
    }
  },
  
  async getClientContacts(clientId: string): Promise<ClientContact[]> {
    try {
      const { data, error } = await supabase
        .from('contacto_clientes')
        .select('id, cliente_id, nombre, cargo, correo, telefono')
        .eq('cliente_id', clientId)
        .eq('estado', true)
        .order('nombre');
      
      if (error) throw error;
      
      return data.map(contact => ({
        id: contact.id,
        clientId: contact.cliente_id,
        nombre: contact.nombre,
        cargo: contact.cargo,
        correo: contact.correo,
        telefono: contact.telefono
      }));
    } catch (error) {
      console.error('Error fetching client contacts:', error);
      return [];
    }
  }
};
