
import { supabase } from "@/integrations/supabase/client";
import { Transport, TransportDB } from "@/data/models/transport";

// Map database transport record to our Transport model
function mapDbToTransport(record: TransportDB): Transport {
  return {
    id: record.id.toString(),
    name: record.razon_social || "",
    ruc: record.ruc || "",
    address: record.direccion || "",
    coverage: record.cobertura || "",
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
    return (data || []).map(mapDbToTransport);
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
    return mapDbToTransport(data as TransportDB);
  } catch (error) {
    console.error("Error in fetchTransportById:", error);
    throw error;
  }
}

export async function createTransport(transport: Partial<Transport>): Promise<Transport> {
  try {
    // Convert our Transport model to a DB record without the id field
    const dbRecord = mapTransportToDbForInsert(transport);
    
    const { data, error } = await supabase
      .from('transportes')
      .insert([dbRecord]) // Use an array to ensure compatibility
      .select()
      .single();

    if (error) {
      console.error("Error creating transport:", error);
      throw new Error(error.message);
    }

    return mapDbToTransport(data as TransportDB);
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

    return mapDbToTransport(data as TransportDB);
  } catch (error) {
    console.error("Error in updateTransport:", error);
    throw error;
  }
}

export async function deleteTransport(id: string): Promise<void> {
  try {
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
