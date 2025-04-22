
import { supabase } from '@/integrations/supabase/client';
import { 
  CompanyCatalog, 
  CompanyCatalogDB, 
  mapCompanyCatalogFromDB, 
  mapCompanyCatalogToDB 
} from '../../models/company.model';
import { stringToNumberId } from '@/utils/id-conversions';

class CompanyCatalogApi {
  async fetchCompanyCatalogs(companyId: string): Promise<CompanyCatalog[]> {
    const numericCompanyId = stringToNumberId(companyId);
    const { data, error } = await supabase
      .from('catalogo_empresas')
      .select('*')
      .eq('empresa_id', numericCompanyId)
      .order('codigo');
      
    if (error) throw error;
    return (data || []).map(mapCompanyCatalogFromDB);
  }

  async fetchCompanyCatalogById(id: string): Promise<CompanyCatalog> {
    const numericId = stringToNumberId(id);
    const { data, error } = await supabase
      .from('catalogo_empresas')
      .select('*')
      .eq('id', numericId)
      .single();
      
    if (error) throw error;
    return mapCompanyCatalogFromDB(data);
  }

  async createCompanyCatalog(catalog: Partial<CompanyCatalog>): Promise<CompanyCatalog> {
    const dbCatalog = mapCompanyCatalogToDB(catalog);
    
    // Ensure empresa_id is required in the database
    if (!dbCatalog.empresa_id) {
      throw new Error('empresa_id is required');
    }
    
    // Fix the typing issue by explicitly setting the values expected by Supabase
    const { data, error } = await supabase
      .from('catalogo_empresas')
      .insert({
        empresa_id: dbCatalog.empresa_id,
        codigo: dbCatalog.codigo,
        created_at: dbCatalog.created_at,
        updated_at: dbCatalog.updated_at
      })
      .select()
      .single();
      
    if (error) throw error;
    return mapCompanyCatalogFromDB(data);
  }

  async updateCompanyCatalog(id: string, catalog: Partial<CompanyCatalog>): Promise<CompanyCatalog> {
    const numericId = stringToNumberId(id);
    const dbCatalog = mapCompanyCatalogToDB(catalog);
    
    const { data, error } = await supabase
      .from('catalogo_empresas')
      .update(dbCatalog)
      .eq('id', numericId)
      .select()
      .single();
      
    if (error) throw error;
    return mapCompanyCatalogFromDB(data);
  }

  async deleteCompanyCatalog(id: string): Promise<void> {
    const numericId = stringToNumberId(id);
    const { error } = await supabase
      .from('catalogo_empresas')
      .delete()
      .eq('id', numericId);
      
    if (error) throw error;
  }
}

export const companyCatalogApi = new CompanyCatalogApi();
