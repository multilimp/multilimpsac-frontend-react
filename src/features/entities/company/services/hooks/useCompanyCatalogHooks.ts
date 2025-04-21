
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { CompanyCatalog } from '../../models/company.model';
import { companyCatalogApi } from '../api/companyCatalogApi';

// React hooks for company catalogs
export const useCompanyCatalogs = (companyId: string) => {
  return useQuery({
    queryKey: ['companyCatalogs', companyId],
    queryFn: () => companyCatalogApi.fetchCompanyCatalogs(companyId),
    enabled: !!companyId
  });
};

export const useCreateCompanyCatalog = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (catalog: Partial<CompanyCatalog>) => companyCatalogApi.createCompanyCatalog(catalog),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['companyCatalogs', variables.empresaId?.toString()] });
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
      companyCatalogApi.updateCompanyCatalog(id, data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['companyCatalogs', result.empresaId.toString()] });
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
      const catalog = await companyCatalogApi.fetchCompanyCatalogById(id);
      await companyCatalogApi.deleteCompanyCatalog(id);
      return catalog;
    },
    onSuccess: (catalog) => {
      queryClient.invalidateQueries({ queryKey: ['companyCatalogs', catalog.empresaId.toString()] });
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
