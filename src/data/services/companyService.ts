
import { supabase } from "@/integrations/supabase/client";
import { Company, CompanyDB } from "@/data/models/company";

// Map database company record to our Company model
function mapDbToCompany(record: CompanyDB): Company {
  return {
    id: record.id.toString(),
    name: record.razon_social || "",
    ruc: record.ruc || "",
    address: record.direccion || "",
    phone: record.telefono || "",
    email: record.correo || "",
    contact: "", // This field is not directly in the DB schema, might need to join with contacts
    status: record.estado ? "active" : "inactive",
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

// Map our Company model to database record for inserts (without id)
function mapCompanyToDbForInsert(company: Partial<Company>) {
  return {
    razon_social: company.name,
    ruc: company.ruc,
    direccion: company.address,
    telefono: company.phone,
    correo: company.email,
    estado: company.status === "active",
  };
}

// Map our Company model to database record for updates
function mapCompanyToDbForUpdate(company: Partial<Company>) {
  return {
    razon_social: company.name,
    ruc: company.ruc,
    direccion: company.address,
    telefono: company.phone,
    correo: company.email,
    estado: company.status === "active",
  };
}

export async function fetchCompanies(): Promise<Company[]> {
  try {
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .order('razon_social', { ascending: true });

    if (error) {
      console.error("Error fetching companies:", error);
      throw new Error(error.message);
    }

    // Transform data to match our Company model
    return (data || []).map(mapDbToCompany);
  } catch (error) {
    console.error("Error in fetchCompanies:", error);
    throw error;
  }
}

export async function fetchCompanyById(id: string): Promise<Company> {
  try {
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .eq('id', parseInt(id))
      .single();

    if (error) {
      console.error("Error fetching company:", error);
      throw new Error(error.message);
    }

    // Transform data to match our Company model
    return mapDbToCompany(data as CompanyDB);
  } catch (error) {
    console.error("Error in fetchCompanyById:", error);
    throw error;
  }
}

export async function createCompany(company: Partial<Company>): Promise<Company> {
  try {
    // Convert our Company model to a DB record without the id field
    const dbRecord = mapCompanyToDbForInsert(company);
    
    // Use type assertion to tell TypeScript this is correct
    const { data, error } = await supabase
      .from('empresas')
      .insert([dbRecord] as any)
      .select()
      .single();

    if (error) {
      console.error("Error creating company:", error);
      throw new Error(error.message);
    }

    return mapDbToCompany(data as CompanyDB);
  } catch (error) {
    console.error("Error in createCompany:", error);
    throw error;
  }
}

export async function updateCompany(id: string, company: Partial<Company>): Promise<Company> {
  try {
    const dbRecord = mapCompanyToDbForUpdate(company);
    
    const { data, error } = await supabase
      .from('empresas')
      .update(dbRecord)
      .eq('id', parseInt(id))
      .select()
      .single();

    if (error) {
      console.error("Error updating company:", error);
      throw new Error(error.message);
    }

    return mapDbToCompany(data as CompanyDB);
  } catch (error) {
    console.error("Error in updateCompany:", error);
    throw error;
  }
}

export async function deleteCompany(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('empresas')
      .delete()
      .eq('id', parseInt(id));

    if (error) {
      console.error("Error deleting company:", error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Error in deleteCompany:", error);
    throw error;
  }
}
