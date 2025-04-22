
import { supabase } from "@/integrations/supabase/client";
import { TransportContact } from "../models/transport.model";

export const getTransportContacts = async (transporteId: string): Promise<TransportContact[]> => {
  try {
    // Convert string ID to number if needed by the database
    const numericId = typeof transporteId === 'string' ? parseInt(transporteId, 10) : transporteId;
    
    const { data, error } = await supabase
      .from('contacto_transportes')
      .select('*')
      .eq('transporte_id', numericId);
    
    if (error) throw error;
    
    // Map database results to our model
    return data.map(item => ({
      id: String(item.id),
      nombre: item.nombre,
      cargo: item.cargo,
      telefono: item.telefono,
      correo: item.correo,
      email: item.correo, // Map correo to email for compatibility
      estado: item.estado,
      transporte_id: String(item.transporte_id)
    }));
  } catch (error) {
    console.error("Error fetching transport contacts:", error);
    throw error;
  }
};

export const createTransportContact = async (contacto: Omit<TransportContact, "id">): Promise<TransportContact> => {
  try {
    // Convert string transporte_id to number for the database
    const numericTransporteId = contacto.transporte_id ? parseInt(contacto.transporte_id, 10) : null;
    
    const { data, error } = await supabase
      .from('contacto_transportes')
      .insert({
        nombre: contacto.nombre,
        cargo: contacto.cargo,
        telefono: contacto.telefono,
        correo: contacto.correo,
        estado: contacto.estado,
        transporte_id: numericTransporteId
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Map database result to our model
    return {
      id: String(data.id),
      nombre: data.nombre,
      cargo: data.cargo,
      telefono: data.telefono,
      correo: data.correo,
      email: data.correo, // Map correo to email for compatibility
      estado: data.estado,
      transporte_id: String(data.transporte_id)
    };
  } catch (error) {
    console.error("Error creating transport contact:", error);
    throw error;
  }
};

export const updateTransportContact = async (id: string, contacto: Partial<TransportContact>): Promise<TransportContact> => {
  try {
    // Convert string ID to number if needed by the database
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    
    // Convert string transporte_id to number for the database if it exists
    const numericTransporteId = contacto.transporte_id ? parseInt(contacto.transporte_id, 10) : undefined;
    
    const { data, error } = await supabase
      .from('contacto_transportes')
      .update({
        nombre: contacto.nombre,
        cargo: contacto.cargo,
        telefono: contacto.telefono,
        correo: contacto.correo,
        estado: contacto.estado,
        transporte_id: numericTransporteId
      })
      .eq('id', numericId)
      .select()
      .single();
    
    if (error) throw error;
    
    // Map database result to our model
    return {
      id: String(data.id),
      nombre: data.nombre,
      cargo: data.cargo,
      telefono: data.telefono,
      correo: data.correo,
      email: data.correo, // Map correo to email for compatibility
      estado: data.estado,
      transporte_id: String(data.transporte_id)
    };
  } catch (error) {
    console.error("Error updating transport contact:", error);
    throw error;
  }
};

export const deleteTransportContact = async (id: string): Promise<void> => {
  try {
    // Convert string ID to number if needed by the database
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    
    const { error } = await supabase
      .from('contacto_transportes')
      .delete()
      .eq('id', numericId);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error deleting transport contact:", error);
    throw error;
  }
};
