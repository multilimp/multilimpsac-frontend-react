
import { supabase } from "@/integrations/supabase/client";
import { Transport, TransportDB } from "@/data/models/transport";

// Map database transport record to our Transport model
async function mapDbToTransport(record: TransportDB): Promise<Transport> {
  // Fetch contact information for this transport
  const { data: contactData, error: contactError } = await supabase
    .from('contacto_transportes')
    .select('*')
    .eq('transporte_id', record.id)
    .eq('estado', true)
    .order('id', { ascending: false })
    .limit(1)
    .single();

  let phone = "";
  let email = "";
  let contact = "";

  if (contactData && !contactError) {
    phone = contactData.telefono || "";
    email = contactData.correo || "";
    contact = contactData.nombre || "";
  }

  return {
    id: record.id.toString(),
    name: record.razon_social || "",
    ruc: record.ruc || "",
    address: record.direccion || "",
    coverage: record.cobertura || "",
    phone,
    email,
    contact,
    status: record.estado ? "active" : "inactive",
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

// Map our Transport model to database record for inserts (without id)
function mapTransportToDbForInsert(transport: Partial<Transport>) {
  return {
    razon_social: transport.name,
    ruc: transport.ruc,
    direccion: transport.address,
    cobertura: transport.coverage,
    estado: transport.status === "active",
  };
}

// Map contact information to database record for inserts
function mapContactToDbForInsert(transportId: number, transport: Partial<Transport>) {
  if (!transport.contact && !transport.email && !transport.phone) {
    return null;
  }
  
  return {
    transporte_id: transportId,
    nombre: transport.contact || "",
    correo: transport.email || "",
    telefono: transport.phone || "",
    cargo: "Contacto Principal",
    estado: true
  };
}

// Map our Transport model to database record for updates
function mapTransportToDbForUpdate(transport: Partial<Transport>) {
  return {
    razon_social: transport.name,
    ruc: transport.ruc,
    direccion: transport.address,
    cobertura: transport.coverage,
    estado: transport.status === "active",
  };
}

export async function fetchTransports(): Promise<Transport[]> {
  try {
    const { data, error } = await supabase
      .from('transportes')
      .select('*')
      .order('razon_social', { ascending: true });

    if (error) {
      console.error("Error fetching transports:", error);
      throw new Error(error.message);
    }

    // Transform data to match our Transport model
    const transports = await Promise.all((data || []).map(mapDbToTransport));
    return transports;
  } catch (error) {
    console.error("Error in fetchTransports:", error);
    throw error;
  }
}

export async function fetchTransportById(id: string): Promise<Transport> {
  try {
    const { data, error } = await supabase
      .from('transportes')
      .select('*')
      .eq('id', parseInt(id))
      .single();

    if (error) {
      console.error("Error fetching transport:", error);
      throw new Error(error.message);
    }

    // Transform data to match our Transport model
    return await mapDbToTransport(data as TransportDB);
  } catch (error) {
    console.error("Error in fetchTransportById:", error);
    throw error;
  }
}

export async function createTransport(transport: Partial<Transport>): Promise<Transport> {
  try {
    // Convert our Transport model to a DB record without the id field
    const dbRecord = mapTransportToDbForInsert(transport);
    
    // Use type assertion to tell TypeScript this is correct
    const { data, error } = await supabase
      .from('transportes')
      .insert([dbRecord] as any)
      .select()
      .single();

    if (error) {
      console.error("Error creating transport:", error);
      throw new Error(error.message);
    }

    // Now create contact information if provided
    if (transport.contact || transport.email || transport.phone) {
      const contactData = mapContactToDbForInsert(data.id, transport);
      if (contactData) {
        const { error: contactError } = await supabase
          .from('contacto_transportes')
          .insert([contactData] as any);
          
        if (contactError) {
          console.warn("Warning: Could not create transport contact:", contactError);
        }
      }
    }

    return await mapDbToTransport(data as TransportDB);
  } catch (error) {
    console.error("Error in createTransport:", error);
    throw error;
  }
}

export async function updateTransport(id: string, transport: Partial<Transport>): Promise<Transport> {
  try {
    const dbRecord = mapTransportToDbForUpdate(transport);
    
    const { data, error } = await supabase
      .from('transportes')
      .update(dbRecord)
      .eq('id', parseInt(id))
      .select()
      .single();

    if (error) {
      console.error("Error updating transport:", error);
      throw new Error(error.message);
    }

    // Update or create contact information if provided
    if (transport.contact || transport.email || transport.phone) {
      // First check if contact exists
      const { data: existingContact } = await supabase
        .from('contacto_transportes')
        .select('id')
        .eq('transporte_id', parseInt(id))
        .eq('estado', true)
        .limit(1)
        .single();

      if (existingContact) {
        // Update existing contact
        await supabase
          .from('contacto_transportes')
          .update({
            nombre: transport.contact,
            correo: transport.email,
            telefono: transport.phone
          })
          .eq('id', existingContact.id);
      } else {
        // Create new contact
        const contactData = mapContactToDbForInsert(parseInt(id), transport);
        if (contactData) {
          await supabase
            .from('contacto_transportes')
            .insert([contactData] as any);
        }
      }
    }

    return await mapDbToTransport(data as TransportDB);
  } catch (error) {
    console.error("Error in updateTransport:", error);
    throw error;
  }
}

export async function deleteTransport(id: string): Promise<void> {
  try {
    // First delete related contacts to avoid foreign key constraints
    await supabase
      .from('contacto_transportes')
      .delete()
      .eq('transporte_id', parseInt(id));
      
    // Then delete the transport
    const { error } = await supabase
      .from('transportes')
      .delete()
      .eq('id', parseInt(id));

    if (error) {
      console.error("Error deleting transport:", error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Error in deleteTransport:", error);
    throw error;
  }
}
