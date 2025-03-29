
import { supabase } from "@/integrations/supabase/client";
import { Supplier, SupplierDB } from "@/data/models/supplier";

// Map database supplier record to our Supplier model
function mapDbToSupplier(record: SupplierDB): Supplier {
  return {
    id: record.id.toString(),
    name: record.razon_social || "",
    ruc: record.ruc || "",
    address: record.direccion || "",
    phone: "", // These fields would need to be fetched from contacto_proveedores
    email: "",
    contact: "", 
    status: record.estado ? "active" : "inactive",
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

// Map our Supplier model to database record
function mapSupplierToDb(supplier: Partial<Supplier>): Partial<SupplierDB> {
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
    return (data || []).map(mapDbToSupplier);
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
    return mapDbToSupplier(data as SupplierDB);
  } catch (error) {
    console.error("Error in fetchSupplierById:", error);
    throw error;
  }
}

export async function createSupplier(supplier: Partial<Supplier>): Promise<Supplier> {
  try {
    const dbRecord = mapSupplierToDb(supplier);
    
    const { data, error } = await supabase
      .from('proveedores')
      .insert(dbRecord)
      .select()
      .single();

    if (error) {
      console.error("Error creating supplier:", error);
      throw new Error(error.message);
    }

    return mapDbToSupplier(data as SupplierDB);
  } catch (error) {
    console.error("Error in createSupplier:", error);
    throw error;
  }
}

export async function updateSupplier(id: string, supplier: Partial<Supplier>): Promise<Supplier> {
  try {
    const dbRecord = mapSupplierToDb(supplier);
    
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

    return mapDbToSupplier(data as SupplierDB);
  } catch (error) {
    console.error("Error in updateSupplier:", error);
    throw error;
  }
}

export async function deleteSupplier(id: string): Promise<void> {
  try {
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
