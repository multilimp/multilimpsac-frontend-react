
import { supabase } from '@/integrations/supabase/client';
import { 
  Company, 
  CompanyDB, 
  mapCompanyFromDB, 
  mapCompanyToDB
} from '../../models/company.model';
import { stringToNumberId } from '@/utils/id-conversions';

// Core company API functions
export const fetchCompanies = async (): Promise<Company[]> => {
  const { data, error } = await supabase
    .from('empresas')
    .select('*')
    .order('razon_social', { ascending: true });
  
  if (error) throw new Error(error.message);
  
  return (data as CompanyDB[]).map(mapCompanyFromDB);
};

export const fetchCompanyById = async (id: string): Promise<Company> => {
  const numericId = stringToNumberId(id);
  const { data, error } = await supabase
    .from('empresas')
    .select('*')
    .eq('id', numericId)
    .single();
  
  if (error) throw new Error(error.message);
  if (!data) throw new Error('Company not found');
  
  return mapCompanyFromDB(data as CompanyDB);
};

export const saveCompany = async (company: Partial<Company>): Promise<Company> => {
  if (company.id) {
    return updateCompany(company.id, company);
  } else {
    return createCompany(company);
  }
};

export const createCompany = async (company: Partial<Company>): Promise<Company> => {
  const mappedData = mapCompanyToDB(company);
  
  const { data, error } = await supabase
    .from('empresas')
    .insert([mappedData])
    .select()
    .single();
  
  if (error) throw new Error(error.message);
  if (!data) throw new Error('Failed to create company');
  
  return mapCompanyFromDB(data as CompanyDB);
};

export const updateCompany = async (id: string, company: Partial<Company>): Promise<Company> => {
  const numericId = stringToNumberId(id);
  const mappedData = mapCompanyToDB(company);
  
  const { data, error } = await supabase
    .from('empresas')
    .update(mappedData)
    .eq('id', numericId)
    .select()
    .single();
  
  if (error) throw new Error(error.message);
  if (!data) throw new Error('Company not found');
  
  return mapCompanyFromDB(data as CompanyDB);
};

export const deleteCompany = async (id: string): Promise<void> => {
  const numericId = stringToNumberId(id);
  const { error } = await supabase
    .from('empresas')
    .delete()
    .eq('id', numericId);
  
  if (error) throw new Error(error.message);
};
