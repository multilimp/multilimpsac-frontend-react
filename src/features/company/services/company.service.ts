
import { createClient } from '@/integrations/supabase/client';
import { Company, CompanyDB, mapCompanyFromDB, mapCompanyToDB } from '../models/company.model';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

// Create a typed Supabase client
const supabase = createClient();

// Core service functions
export const companyService = {
  // Fetch all companies
  fetchCompanies: async (): Promise<Company[]> => {
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .order('razon_social', { ascending: true });
    
    if (error) throw new Error(error.message);
    
    return (data as CompanyDB[]).map(mapCompanyFromDB);
  },
  
  // Fetch a single company by ID
  fetchCompanyById: async (id: string): Promise<Company> => {
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw new Error(error.message);
    if (!data) throw new Error('Company not found');
    
    return mapCompanyFromDB(data as CompanyDB);
  },
  
  // Create a new company
  createCompany: async (company: Omit<Company, 'id'>): Promise<Company> => {
    const mappedData = mapCompanyToDB(company);
    
    const { data, error } = await supabase
      .from('empresas')
      .insert(mappedData)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    if (!data) throw new Error('Failed to create company');
    
    return mapCompanyFromDB(data as CompanyDB);
  },
  
  // Update an existing company
  updateCompany: async (id: string, company: Partial<Company>): Promise<Company> => {
    const mappedData = mapCompanyToDB(company);
    
    const { data, error } = await supabase
      .from('empresas')
      .update(mappedData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    if (!data) throw new Error('Company not found');
    
    return mapCompanyFromDB(data as CompanyDB);
  },
  
  // Delete a company
  deleteCompany: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('empresas')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
  }
};

// React hooks for the company domain
export const useCompanies = () => {
  return useQuery({
    queryKey: ['companies'],
    queryFn: companyService.fetchCompanies
  });
};

export const useCompany = (id: string) => {
  return useQuery({
    queryKey: ['companies', id],
    queryFn: () => companyService.fetchCompanyById(id),
    enabled: !!id
  });
};

export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: companyService.createCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({
        title: "Empresa creada",
        description: "La empresa ha sido creada exitosamente"
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudo crear la empresa: ${error.message}`
      });
    }
  });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Company> }) =>
      companyService.updateCompany(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['companies', variables.id] });
      toast({
        title: "Empresa actualizada",
        description: "La empresa ha sido actualizada exitosamente"
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudo actualizar la empresa: ${error.message}`
      });
    }
  });
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: companyService.deleteCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({
        title: "Empresa eliminada",
        description: "La empresa ha sido eliminada exitosamente"
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudo eliminar la empresa: ${error.message}`
      });
    }
  });
};
