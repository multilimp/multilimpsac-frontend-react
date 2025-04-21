
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
} from '../../models/client.model';
import { stringToNumberId } from '@/core/utils/id-conversions';

export const clienteApi = {
  // Cliente methods
  async fetchClientes(): Promise<Cliente[]> {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('razon_social');
      
    if (error) throw error;
    return (data || []).map(mapClienteFromDB);
  },

  async fetchClienteById(id: string): Promise<Cliente> {
    const numericId = stringToNumberId(id);
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', numericId)
      .single();
      
    if (error) throw error;
    return mapClienteFromDB(data);
  },

  async createCliente(cliente: Partial<Cliente>): Promise<Cliente> {
    const dbCliente = mapClienteToDB(cliente);
    const { data, error } = await supabase
      .from('clientes')
      .insert([dbCliente])
      .select()
      .single();
      
    if (error) throw error;
    return mapClienteFromDB(data);
  },

  async updateCliente(id: string, cliente: Partial<Cliente>): Promise<Cliente> {
    const numericId = stringToNumberId(id);
    const { data, error } = await supabase
      .from('clientes')
      .update(mapClienteToDB(cliente))
      .eq('id', numericId)
      .select()
      .single();
      
    if (error) throw error;
    return mapClienteFromDB(data);
  },

  async deleteCliente(id: string): Promise<void> {
    const numericId = stringToNumberId(id);
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', numericId);
      
    if (error) throw error;
  },

  // Contacto methods
  async fetchContactosCliente(clienteId: string): Promise<ContactoCliente[]> {
    const numericClienteId = stringToNumberId(clienteId);
    const { data, error } = await supabase
      .from('contacto_clientes')
      .select('*')
      .eq('cliente_id', numericClienteId)
      .order('nombre');
      
    if (error) throw error;
    return (data || []).map(mapContactoClienteFromDB);
  },

  async createContactoCliente(contacto: Partial<ContactoCliente>): Promise<ContactoCliente> {
    const dbContacto = mapContactoClienteToDB(contacto);
    const { data, error } = await supabase
      .from('contacto_clientes')
      .insert([dbContacto])
      .select()
      .single();
      
    if (error) throw error;
    return mapContactoClienteFromDB(data);
  },

  async updateContactoCliente(id: string, contacto: Partial<ContactoCliente>): Promise<ContactoCliente> {
    const numericId = stringToNumberId(id);
    const { data, error } = await supabase
      .from('contacto_clientes')
      .update(mapContactoClienteToDB(contacto))
      .eq('id', numericId)
      .select()
      .single();
      
    if (error) throw error;
    return mapContactoClienteFromDB(data);
  },

  async deleteContactoCliente(id: string): Promise<void> {
    const numericId = stringToNumberId(id);
    const { error } = await supabase
      .from('contacto_clientes')
      .delete()
      .eq('id', numericId);
      
    if (error) throw error;
  }
};
