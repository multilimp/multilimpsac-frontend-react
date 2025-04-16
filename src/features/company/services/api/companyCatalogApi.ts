
import { supabase } from '@/integrations/supabase/client';
import { 
  CompanyCatalog, 
  CompanyCatalogDB, 
  mapCompanyCatalogFromDB, 
  mapCompanyCatalogToDB 
} from '../../models/company.model';

// Company catalog API functions
export const fetchCompanyCatalogs = async (companyId: string): Promise<CompanyCatalog[]> => {
  const { data, error } = await supabase
    .from('catalogo_empresas')
    .select('*')
    .eq('empresa_id', parseInt(companyId))
    .order('created_at', { ascending: false });
  
  if (error) throw new Error(error.message);
  
  return (data as CompanyCatalogDB[]).map(mapCompanyCatalogFromDB);
};

export const fetchCompanyCatalogById = async (id: string): Promise<CompanyCatalog> => {
  const { data, error } = await supabase
    .from('catalogo_empresas')
    .select('*')
    .eq('id', parseInt(id))
    .single();
  
  if (error) throw new Error(error.message);
  if (!data) throw new Error('Catalog not found');
  
  return mapCompanyCatalogFromDB(data as CompanyCatalogDB);
};

export const saveCompanyCatalog = async (catalog: Partial<CompanyCatalog>): Promise<CompanyCatalog> => {
  if (catalog.id) {
    return updateCompanyCatalog(catalog.id, catalog);
  } else {
    return createCompanyCatalog(catalog);
  }
};

export const createCompanyCatalog = async (catalog: Partial<CompanyCatalog>): Promise<CompanyCatalog> => {
  try {
    // This will throw an error if empresa_id is missing
    const mappedData = mapCompanyCatalogToDB(catalog);
    
    const { data, error } = await supabase
      .from('catalogo_empresas')
      .insert(mappedData)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    if (!data) throw new Error('Failed to create catalog');
    
    return mapCompanyCatalogFromDB(data as CompanyCatalogDB);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};

export const updateCompanyCatalog = async (id: string, catalog: Partial<CompanyCatalog>): Promise<CompanyCatalog> => {
  try {
    const mappedData = mapCompanyCatalogToDB(catalog);
    
    const { data, error } = await supabase
      .from('catalogo_empresas')
      .update(mappedData)
      .eq('id', parseInt(id))
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    if (!data) throw new Error('Catalog not found');
    
    return mapCompanyCatalogFromDB(data as CompanyCatalogDB);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};

export const deleteCompanyCatalog = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('catalogo_empresas')
    .delete()
    .eq('id', parseInt(id));
  
  if (error) throw new Error(error.message);
};
