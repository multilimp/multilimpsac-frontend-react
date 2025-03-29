
import { supabase } from "@/integrations/supabase/client";
import { Supplier, SupplierDB } from "@/data/models/supplier";

// Map database supplier record to our Supplier model
async function mapDbToSupplier(record: SupplierDB): Promise<Supplier> {
  // Fetch contact information for this supplier
  const { data: contactData, error: contactError } = await supabase
    .from('contacto_proveedores')
    .select('*')
    .eq('proveedor_id', record.id)
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
    phone,
    email,
    contact,
    status: record.estado ? "active" : "inactive",
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

// Map our Supplier model to database record for inserts (without id)
function mapSupplierToDbForInsert(supplier: Partial<Supplier>) {
  return {
    razon_social: supplier.name,
    ruc: supplier.ruc,
    direccion: supplier.address,
    estado: supplier.status === "active",
  };
}

// Map contact information to database record for inserts
function mapContactToDbForInsert(supplierId: number, supplier: Partial<Supplier>) {
  if (!supplier.contact && !supplier.email && !supplier.phone) {
    return null;
  }
  
  return {
    proveedor_id: supplierId,
    nombre: supplier.contact || "",
    correo: supplier.email || "",
    telefono: supplier.phone || "",
    cargo: "Contacto Principal",
    estado: true
  };
}

// Map our Supplier model to database record for updates
function mapSupplierToDbForUpdate(supplier: Partial<Supplier>) {
  return {
    razon_social: supplier.name,
    ruc: supplier.ruc,
    direccion: supplier.address,
    estado: supplier.status === "active",
  };
}

export async function fetchSuppliers(): Promise<Supplier[]> {
  try {
    const { data, error } = await supabase
      .from('proveedores')
      .select('*')
      .order('razon_social', { ascending: true });

    if (error) {
      console.error("Error fetching suppliers:", error);
      throw new Error(error.message);
    }

    // Transform data to match our Supplier model
    const suppliers = await Promise.all((data || []).map(mapDbToSupplier));
    return suppliers;
  } catch (error) {
    console.error("Error in fetchSuppliers:", error);
    throw error;
  }
}

export async function fetchSupplierById(id: string): Promise<Supplier> {
  try {
    const { data, error } = await supabase
      .from('proveedores')
      .select('*')
      .eq('id', parseInt(id))
      .single();

    if (error) {
      console.error("Error fetching supplier:", error);
      throw new Error(error.message);
    }

    // Transform data to match our Supplier model
    return await mapDbToSupplier(data as SupplierDB);
  } catch (error) {
    console.error("Error in fetchSupplierById:", error);
    throw error;
  }
}

export async function createSupplier(supplier: Partial<Supplier>): Promise<Supplier> {
  try {
    // Convert our Supplier model to a DB record without the id field
    const dbRecord = mapSupplierToDbForInsert(supplier);
    
    // Use type assertion to tell TypeScript this is correct
    const { data, error } = await supabase
      .from('proveedores')
      .insert([dbRecord] as any)
      .select()
      .single();

    if (error) {
      console.error("Error creating supplier:", error);
      throw new Error(error.message);
    }

    // Now create contact information if provided
    const contactData = mapContactToDbForInsert(data.id, supplier);
    if (contactData) {
      const { error: contactError } = await supabase
        .from('contacto_proveedores')
        .insert([contactData] as any);
        
      if (contactError) {
        console.warn("Warning: Could not create supplier contact:", contactError);
      }
    }

    return await mapDbToSupplier(data as SupplierDB);
  } catch (error) {
    console.error("Error in createSupplier:", error);
    throw error;
  }
}

export async function updateSupplier(id: string, supplier: Partial<Supplier>): Promise<Supplier> {
  try {
    const dbRecord = mapSupplierToDbForUpdate(supplier);
    
    const { data, error } = await supabase
      .from('proveedores')
      .update(dbRecord)
      .eq('id', parseInt(id))
      .select()
      .single();

    if (error) {
      console.error("Error updating supplier:", error);
      throw new Error(error.message);
    }

    // Update or create contact information if provided
    if (supplier.contact || supplier.email || supplier.phone) {
      // First check if contact exists
      const { data: existingContact } = await supabase
        .from('contacto_proveedores')
        .select('id')
        .eq('proveedor_id', parseInt(id))
        .eq('estado', true)
        .limit(1)
        .single();

      if (existingContact) {
        // Update existing contact
        await supabase
          .from('contacto_proveedores')
          .update({
            nombre: supplier.contact,
            correo: supplier.email,
            telefono: supplier.phone
          })
          .eq('id', existingContact.id);
      } else {
        // Create new contact
        const contactData = mapContactToDbForInsert(parseInt(id), supplier);
        if (contactData) {
          await supabase
            .from('contacto_proveedores')
            .insert([contactData] as any);
        }
      }
    }

    return await mapDbToSupplier(data as SupplierDB);
  } catch (error) {
    console.error("Error in updateSupplier:", error);
    throw error;
  }
}

export async function deleteSupplier(id: string): Promise<void> {
  try {
    // First delete related contacts to avoid foreign key constraints
    await supabase
      .from('contacto_proveedores')
      .delete()
      .eq('proveedor_id', parseInt(id));
      
    // Then delete the supplier
    const { error } = await supabase
      .from('proveedores')
      .delete()
      .eq('id', parseInt(id));

    if (error) {
      console.error("Error deleting supplier:", error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Error in deleteSupplier:", error);
    throw error;
  }
}
