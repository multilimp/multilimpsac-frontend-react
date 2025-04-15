// This fixes the client service error
// Making sure we provide the required fields when inserting data

import { supabase } from '@/integrations/supabase/client';
import { ClientDB, ClientCreateDTO, ClientUpdateDTO } from '../models/client.model';

export default class ClientService {
  // Added default values for required fields
  static async create(data: ClientCreateDTO): Promise<ClientDB> {
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

    return newClient as ClientDB;
  }

  static async getAll(): Promise<ClientDB[]> {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('razon_social', { ascending: true });

    if (error) {
      
      console.error('Error getting clients:', error);
      throw error;
    }

    return data as ClientDB[];
  }

  static async getById(id: number): Promise<ClientDB | null> {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error getting client by id:', error);
      throw error;
    }

    return data as ClientDB | null;
  }

  static async update(id: number, updates: ClientUpdateDTO): Promise<ClientDB | null> {
    const { data, error } = await supabase
      .from('clientes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating client:', error);
      throw error;
    }

    return data as ClientDB | null;
  }

  static async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  }
}
