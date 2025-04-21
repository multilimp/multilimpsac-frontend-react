
import { supabase } from '@/integrations/supabase/client';
import { Company, CompanyDB, mapCompanyFromDB, mapCompanyToDB } from '../models/company.model';

export default class CompanyService {
  static async getById(id: string): Promise<Company> {
    try {
      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .eq('id', parseInt(id))
        .single();

      if (error) throw error;
      if (!data) throw new Error('Company not found');

      return mapCompanyFromDB(data as CompanyDB);
    } catch (error) {
      console.error('Error fetching company:', error);
      throw error;
    }
  }

  static async getAll(): Promise<Company[]> {
    try {
      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .order('razon_social', { ascending: true });

      if (error) throw error;

      return (data as CompanyDB[]).map(mapCompanyFromDB);
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  }

  static async create(company: Partial<Company>): Promise<Company> {
    try {
      const mappedData = mapCompanyToDB(company as Company);

      const { data, error } = await supabase
        .from('empresas')
        .insert(mappedData)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Company creation failed');

      return mapCompanyFromDB(data as CompanyDB);
    } catch (error) {
      console.error('Error creating company:', error);
      throw error;
    }
  }

  static async update(id: string, company: Partial<Company>): Promise<Company> {
    try {
      const mappedData = mapCompanyToDB(company as Company);

      const { data, error } = await supabase
        .from('empresas')
        .update(mappedData)
        .eq('id', parseInt(id))
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Company update failed');

      return mapCompanyFromDB(data as CompanyDB);
    } catch (error) {
      console.error('Error updating company:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('empresas')
        .delete()
        .eq('id', parseInt(id));

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting company:', error);
      throw error;
    }
  }

  static async fetchCatalogs(companyId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('catalogo_empresas')
        .select('*')
        .eq('empresa_id', parseInt(companyId));

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching company catalogs:', error);
      throw error;
    }
  }

  static async createCatalog(companyId: string, catalog: any): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('catalogo_empresas')
        .insert({ ...catalog, empresa_id: parseInt(companyId) })
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error creating company catalog:', error);
      throw error;
    }
  }

  static async updateCatalog(id: string, catalog: any): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('catalogo_empresas')
        .update(catalog)
        .eq('id', parseInt(id))
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error updating company catalog:', error);
      throw error;
    }
  }

  static async deleteCatalog(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('catalogo_empresas')
        .delete()
        .eq('id', parseInt(id));

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting company catalog:', error);
      throw error;
    }
  }
}
