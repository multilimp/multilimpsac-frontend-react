import { supabase } from '@/integrations/supabase/client';
import { 
  Company, 
  CompanyDB, 
  CompanyCatalog, 
  CompanyCatalogDB, 
  mapCompanyFromDB, 
  mapCompanyToDB, 
  mapCompanyCatalogFromDB, 
  mapCompanyCatalogToDB 
} from '../models/company.model';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

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
      .eq('id', parseInt(id))
      .single();
    
    if (error) throw new Error(error.message);
    if (!data) throw new Error('Company not found');
    
    return mapCompanyFromDB(data as CompanyDB);
  },
  
  // Save a company (create or update)
  saveCompany: async (company: Partial<Company>): Promise<Company> => {
    if (company.id) {
      return companyService.updateCompany(company.id, company);
    } else {
      return companyService.createCompany(company as Omit<Company, 'id'>);
    }
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
      .eq('id', parseInt(id))
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
      .eq('id', parseInt(id));
    
    if (error) throw new Error(error.message);
  },

  // Fetch all catalogs for a company
  fetchCompanyCatalogs: async (companyId: string): Promise<CompanyCatalog[]> => {
    const { data, error } = await supabase
      .from('catalogo_empresas')
      .select('*')
      .eq('empresa_id', parseInt(companyId))
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    
    return (data as CompanyCatalogDB[]).map(mapCompanyCatalogFromDB);
  },

  // Fetch a single catalog by ID
  fetchCompanyCatalogById: async (id: string): Promise<CompanyCatalog> => {
    const { data, error } = await supabase
      .from('catalogo_empresas')
      .select('*')
      .eq('id', parseInt(id))
      .single();
    
    if (error) throw new Error(error.message);
    if (!data) throw new Error('Catalog not found');
    
    return mapCompanyCatalogFromDB(data as CompanyCatalogDB);
  },

  // Save a company catalog (create or update)
  saveCompanyCatalog: async (catalog: Partial<CompanyCatalog>): Promise<CompanyCatalog> => {
    if (catalog.id) {
      return companyService.updateCompanyCatalog(catalog.id, catalog);
    } else {
      return companyService.createCompanyCatalog(catalog);
    }
  },

  // Create a new company catalog
  createCompanyCatalog: async (catalog: Partial<CompanyCatalog>): Promise<CompanyCatalog> => {
    const mappedData = mapCompanyCatalogToDB(catalog);
    
    // Ensure empresa_id is set correctly - it's required by Supabase
    if (!mappedData.empresa_id) {
      throw new Error('Company ID is required');
    }

    const { data, error } = await supabase
      .from('catalogo_empresas')
      .insert(mappedData)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    if (!data) throw new Error('Failed to create catalog');
    
    return mapCompanyCatalogFromDB(data as CompanyCatalogDB);
  },

  // Update an existing company catalog
  updateCompanyCatalog: async (id: string, catalog: Partial<CompanyCatalog>): Promise<CompanyCatalog> => {
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
  },

  // Delete a company catalog
  deleteCompanyCatalog: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('catalogo_empresas')
      .delete()
      .eq('id', parseInt(id));
    
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

export const useCompanyCatalogs = (companyId: string) => {
  return useQuery({
    queryKey: ['companyCatalogs', companyId],
    queryFn: () => companyService.fetchCompanyCatalogs(companyId),
    enabled: !!companyId
  });
};

export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (company: Omit<Company, 'id'>) => companyService.createCompany(company),
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

export const useCreateCompanyCatalog = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (catalog: Partial<CompanyCatalog>) => companyService.createCompanyCatalog(catalog),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['companyCatalogs', variables.empresa_id?.toString()] });
      toast({
        title: "Catálogo creado",
        description: "El catálogo ha sido creado exitosamente"
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudo crear el catálogo: ${error.message}`
      });
    }
  });
};

export const useUpdateCompanyCatalog = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CompanyCatalog> }) =>
      companyService.updateCompanyCatalog(id, data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['companyCatalogs', result.empresa_id.toString()] });
      toast({
        title: "Catálogo actualizado",
        description: "El catálogo ha sido actualizado exitosamente"
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudo actualizar el catálogo: ${error.message}`
      });
    }
  });
};

export const useDeleteCompanyCatalog = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (id: string) => {
      // Get catalog info before deleting to know which company it belongs to
      const catalog = await companyService.fetchCompanyCatalogById(id);
      await companyService.deleteCompanyCatalog(id);
      return catalog;
    },
    onSuccess: (catalog) => {
      queryClient.invalidateQueries({ queryKey: ['companyCatalogs', catalog.empresa_id.toString()] });
      toast({
        title: "Catálogo eliminado",
        description: "El catálogo ha sido eliminado exitosamente"
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudo eliminar el catálogo: ${error.message}`
      });
    }
  });
};
