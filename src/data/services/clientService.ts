
import { supabase } from "@/integrations/supabase/client";
import { Client, ClientDB } from "@/data/models/client";

// Map database client record to our Client model
function mapDbToClient(record: ClientDB): Client {
  return {
    id: record.id.toString(),
    name: record.razon_social || "",
    ruc: record.ruc || "",
    address: record.direccion || "",
    phone: record.telefono || "",
    email: record.correo || "",
    contact: "", // This field is not directly in the DB schema, would need to join with contacts
    status: record.estado ? "active" : "inactive",
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

// Map our Client model to database record
function mapClientToDb(client: Partial<Client>): Partial<ClientDB> {
  return {
    razon_social: client.name,
    ruc: client.ruc,
    direccion: client.address,
    telefono: client.phone,
    correo: client.email,
    estado: client.status === "active",
  };
}

export async function fetchClients(): Promise<Client[]> {
  try {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('razon_social', { ascending: true });

    if (error) {
      console.error("Error fetching clients:", error);
      throw new Error(error.message);
    }

    // Transform data to match our Client model
    return (data || []).map(mapDbToClient);
  } catch (error) {
    console.error("Error in fetchClients:", error);
    throw error;
  }
}

export async function fetchClientById(id: string): Promise<Client> {
  try {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', parseInt(id))
      .single();

    if (error) {
      console.error("Error fetching client:", error);
      throw new Error(error.message);
    }

    // Transform data to match our Client model
    return mapDbToClient(data as ClientDB);
  } catch (error) {
    console.error("Error in fetchClientById:", error);
    throw error;
  }
}

export async function createClient(client: Partial<Client>): Promise<Client> {
  try {
    // Convert our Client model to a DB record without the id field
    const dbRecord = mapClientToDb(client);
    
    const { data, error } = await supabase
      .from('clientes')
      .insert(dbRecord)
      .select()
      .single();

    if (error) {
      console.error("Error creating client:", error);
      throw new Error(error.message);
    }

    return mapDbToClient(data as ClientDB);
  } catch (error) {
    console.error("Error in createClient:", error);
    throw error;
  }
}

export async function updateClient(id: string, client: Partial<Client>): Promise<Client> {
  try {
    const dbRecord = mapClientToDb(client);
    
    const { data, error } = await supabase
      .from('clientes')
      .update(dbRecord)
      .eq('id', parseInt(id))
      .select()
      .single();

    if (error) {
      console.error("Error updating client:", error);
      throw new Error(error.message);
    }

    return mapDbToClient(data as ClientDB);
  } catch (error) {
    console.error("Error in updateClient:", error);
    throw error;
  }
}

export async function deleteClient(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', parseInt(id));

    if (error) {
      console.error("Error deleting client:", error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Error in deleteClient:", error);
    throw error;
  }
}
