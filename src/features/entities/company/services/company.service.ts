import { supabase } from '@/integrations/supabase/client';
import { Company, CompanyDB, CompanyCatalog, CompanyCatalogDB } from '../models/company.model';
import { mapCompanyFromDB, mapCompanyToDB, mapCatalogoFromDB, mapCatalogoToDB } from '../models/company.model';

export class CompanyService {
  static async getAll(): Promise<Company[]> {
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .order('razon_social', { ascending: true });

    if (error) throw error;
    return data.map(mapCompanyFromDB);
  }

  static async getById(id: string): Promise<Company> {
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return mapCompanyFromDB(data);
  }

  static async create(company: Partial<Company>): Promise<Company> {
    const data = mapCompanyToDB(company as Company);
    const required = {
      ruc: data.ruc || '',
      razon_social: data.razon_social || '',
      direccion: data.direccion || '',
      estado: true
    };

    const { data: newCompany, error } = await supabase
      .from('empresas')
      .insert({ ...data, ...required })
      .select()
      .single();

    if (error) throw error;
    return mapCompanyFromDB(newCompany);
  }

  static async update(id: string, company: Partial<Company>): Promise<Company> {
    const data = mapCompanyToDB(company as Company);

    const { data: updatedCompany, error } = await supabase
      .from('empresas')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapCompanyFromDB(updatedCompany);
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('empresas')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async getAllCatalogs(): Promise<CompanyCatalog[]> {
    const { data, error } = await supabase
      .from('catalogo_empresas')
      .select('*')
      .order('codigo', { ascending: true });

    if (error) throw error;
    return data.map(mapCatalogoFromDB);
  }

  static async getCatalogById(id: string): Promise<CompanyCatalog> {
    const { data, error } = await supabase
      .from('catalogo_empresas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return mapCatalogoFromDB(data);
  }

  static async createCatalog(catalog: Partial<CompanyCatalog>): Promise<CompanyCatalog> {
    const data = mapCatalogoToDB(catalog as CompanyCatalog);
    const required = {
      empresa_id: data.empresa_id,
      codigo: data.codigo || '',
    };

    const { data: newCatalog, error } = await supabase
      .from('catalogo_empresas')
      .insert({ ...data, ...required })
      .select()
      .single();

    if (error) throw error;
    return mapCatalogoFromDB(newCatalog);
  }

  static async updateCatalog(id: string, catalog: Partial<CompanyCatalog>): Promise<CompanyCatalog> {
    const data = mapCatalogoToDB(catalog as CompanyCatalog);

    const { data: updatedCatalog, error } = await supabase
      .from('catalogo_empresas')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapCatalogoFromDB(updatedCatalog);
  }

  static async deleteCatalog(id: string): Promise<void> {
    const { error } = await supabase
      .from('catalogo_empresas')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
