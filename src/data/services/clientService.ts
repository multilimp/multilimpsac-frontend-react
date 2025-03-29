
import { supabase } from "@/integrations/supabase/client";
import { Client, ClientDB } from "@/data/models/client";

// Map database client record to our Client model
async function mapDbToClient(record: ClientDB): Promise<Client> {
  // Fetch contact information for this client
  const { data: contactData, error: contactError } = await supabase
    .from('contacto_clientes')
    .select('*')
    .eq('cliente_id', record.id)
    .eq('estado', true)
    .order('id', { ascending: false })
    .limit(1)
    .single();

  let phone = record.telefono || "";
  let email = record.correo || "";
  let contact = "";

  if (contactData && !contactError) {
    // Override with contact data if available
    if (contactData.telefono) phone = contactData.telefono;
    if (contactData.correo) email = contactData.correo;
    contact = contactData.nombre || "";
  }

  return {
    id: record.id.toString(),
    name: record.razon_social || "",
    ruc: record.ruc || "",
    address: record.direccion || "",
    phone,
    email,
    contact,
    status: record.estado ? "active" : "inactive",
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

// Map our Client model to database record for inserts (without id)
function mapClientToDbForInsert(client: Partial<Client>) {
  return {
    razon_social: client.name,
    ruc: client.ruc,
    direccion: client.address,
    telefono: client.phone,
    correo: client.email,
    estado: client.status === "active",
  };
}

// Map contact information to database record for inserts
function mapContactToDbForInsert(clientId: number, client: Partial<Client>) {
  if (!client.contact && !client.email && !client.phone) {
    return null;
  }
  
  return {
    cliente_id: clientId,
    nombre: client.contact || "",
    correo: client.email || "",
    telefono: client.phone || "",
    cargo: "Contacto Principal",
    estado: true
  };
}

// Map our Client model to database record for updates
function mapClientToDbForUpdate(client: Partial<Client>) {
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
    const clients = await Promise.all((data || []).map(mapDbToClient));
    return clients;
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
    return await mapDbToClient(data as ClientDB);
  } catch (error) {
    console.error("Error in fetchClientById:", error);
    throw error;
  }
}

export async function createClient(client: Partial<Client>): Promise<Client> {
  try {
    // Convert our Client model to a DB record without the id field
    const dbRecord = mapClientToDbForInsert(client);
    
    // Use type assertion to tell TypeScript this is correct
    const { data, error } = await supabase
      .from('clientes')
      .insert([dbRecord] as any)
      .select()
      .single();

    if (error) {
      console.error("Error creating client:", error);
      throw new Error(error.message);
    }

    // Now create contact information if provided
    if (client.contact) {
      const contactData = mapContactToDbForInsert(data.id, client);
      if (contactData) {
        const { error: contactError } = await supabase
          .from('contacto_clientes')
          .insert([contactData] as any);
          
        if (contactError) {
          console.warn("Warning: Could not create client contact:", contactError);
        }
      }
    }

    return await mapDbToClient(data as ClientDB);
  } catch (error) {
    console.error("Error in createClient:", error);
    throw error;
  }
}

export async function updateClient(id: string, client: Partial<Client>): Promise<Client> {
  try {
    const dbRecord = mapClientToDbForUpdate(client);
    
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

    // Update or create contact information if provided
    if (client.contact) {
      // First check if contact exists
      const { data: existingContact } = await supabase
        .from('contacto_clientes')
        .select('id')
        .eq('cliente_id', parseInt(id))
        .eq('estado', true)
        .limit(1)
        .single();

      if (existingContact) {
        // Update existing contact
        await supabase
          .from('contacto_clientes')
          .update({
            nombre: client.contact,
            correo: client.email,
            telefono: client.phone
          })
          .eq('id', existingContact.id);
      } else {
        // Create new contact
        const contactData = mapContactToDbForInsert(parseInt(id), client);
        if (contactData) {
          await supabase
            .from('contacto_clientes')
            .insert([contactData] as any);
        }
      }
    }

    return await mapDbToClient(data as ClientDB);
  } catch (error) {
    console.error("Error in updateClient:", error);
    throw error;
  }
}

export async function deleteClient(id: string): Promise<void> {
  try {
    // First delete related contacts to avoid foreign key constraints
    await supabase
      .from('contacto_clientes')
      .delete()
      .eq('cliente_id', parseInt(id));
      
    // Then delete the client
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
