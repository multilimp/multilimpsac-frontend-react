
import { supabase } from '@/integrations/supabase/client';
import { CompanyCatalog, CompanyCatalogDB } from '../../models/companyCatalog';

export class CompanyCatalogApi {
  static async getAll(companyId: string): Promise<CompanyCatalog[]> {
    try {
      const { data, error } = await supabase
        .from('catalogo_empresas')
        .select('*')
        .eq('empresa_id', parseInt(companyId));

      if (error) {
        throw new Error(`Error fetching catalogs: ${error.message}`);
      }

      if (!data || data.length === 0) {
        return [];
      }

      return data.map(this.mapFromDB);
    } catch (error) {
      console.error('Error in getAll catalogs:', error);
      throw error;
    }
  }

  static async getById(id: string): Promise<CompanyCatalog> {
    try {
      const { data, error } = await supabase
        .from('catalogo_empresas')
        .select('*')
        .eq('id', parseInt(id))
        .single();

      if (error) {
        throw new Error(`Error fetching catalog: ${error.message}`);
      }

      return this.mapFromDB(data);
    } catch (error) {
      console.error('Error in getById catalog:', error);
      throw error;
    }
  }

  static async create(companyId: string, catalog: Partial<CompanyCatalog>): Promise<CompanyCatalog> {
    try {
      const dbCatalog: Partial<CompanyCatalogDB> = {
        ...this.mapToDB(catalog),
        empresa_id: parseInt(companyId) // Ensure empresa_id is included and is a number
      };

      const { data, error } = await supabase
        .from('catalogo_empresas')
        .insert(dbCatalog)
        .select()
        .single();

      if (error) {
        throw new Error(`Error creating catalog: ${error.message}`);
      }

      return this.mapFromDB(data);
    } catch (error) {
      console.error('Error in create catalog:', error);
      throw error;
    }
  }

  static async update(id: string, catalog: Partial<CompanyCatalog>): Promise<CompanyCatalog> {
    try {
      const { data, error } = await supabase
        .from('catalogo_empresas')
        .update(this.mapToDB(catalog))
        .eq('id', parseInt(id))
        .select()
        .single();

      if (error) {
        throw new Error(`Error updating catalog: ${error.message}`);
      }

      return this.mapFromDB(data);
    } catch (error) {
      console.error('Error in update catalog:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('catalogo_empresas')
        .delete()
        .eq('id', parseInt(id));

      if (error) {
        throw new Error(`Error deleting catalog: ${error.message}`);
      }
    } catch (error) {
      console.error('Error in delete catalog:', error);
      throw error;
    }
  }

  private static mapFromDB(data: any): CompanyCatalog {
    return {
      id: data.id.toString(),
      code: data.codigo || '',
      companyId: data.empresa_id.toString(),
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  private static mapToDB(catalog: Partial<CompanyCatalog>): Partial<CompanyCatalogDB> {
    const result: Partial<CompanyCatalogDB> = {};
    
    if (catalog.id) result.id = parseInt(catalog.id);
    if (catalog.code) result.codigo = catalog.code;
    if (catalog.companyId) result.empresa_id = parseInt(catalog.companyId);
    
    return result;
  }
}
