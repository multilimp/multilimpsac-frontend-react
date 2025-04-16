
// This fixes the client service error
// Making sure we provide the required fields when inserting data

import { supabase } from '@/integrations/supabase/client';
import { ClienteDB } from '../models/client.model';

// Remove the imports for ClienteCreateDTO and ClienteUpdateDTO since they don't exist
export default class ClientService {
  // Added default values for required fields
  static async create(data: Partial<ClienteDB>): Promise<ClienteDB> {
    // Ensure required fields are provided, with defaults if not
    const clientData = {
      ...data,
      cod_unidad: data.cod_unidad || 'DEFAULT',
      razon_social: data.razon_social || 'Nueva razón social',
      ruc: data.ruc || '00000000000',
      direccion: data.direccion || 'Nueva dirección',
      provincia: data.provincia || 'Nueva provincia',
      distrito: data.distrito || 'Nuevo distrito',
      departamento: data.departamento || 'Nuevo departamento',
      estado: data.estado !== undefined ? data.estado : true
    };

    const { data: newClient, error } = await supabase
      .from('clientes')
      .insert(clientData)
      .select()
      .single();

    if (error) {
      console.error('Error creating client:', error);
      throw error;
    }

    return newClient as ClienteDB;
  }

  static async getAll(): Promise<ClienteDB[]> {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('razon_social', { ascending: true });

    if (error) {
      console.error('Error getting clients:', error);
      throw error;
    }

    return data as ClienteDB[];
  }

  static async getById(id: number | string): Promise<ClienteDB | null> {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', typeof id === 'string' ? parseInt(id, 10) : id)
      .single();

    if (error) {
      console.error('Error getting client by id:', error);
      throw error;
    }

    return data as ClienteDB | null;
  }

  static async update(id: number | string, updates: Partial<ClienteDB>): Promise<ClienteDB | null> {
    const { data, error } = await supabase
      .from('clientes')
      .update(updates)
      .eq('id', typeof id === 'string' ? parseInt(id, 10) : id)
      .select()
      .single();

    if (error) {
      console.error('Error updating client:', error);
      throw error;
    }

    return data as ClienteDB | null;
  }

  static async delete(id: number | string): Promise<void> {
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', typeof id === 'string' ? parseInt(id, 10) : id);

    if (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  }
}
