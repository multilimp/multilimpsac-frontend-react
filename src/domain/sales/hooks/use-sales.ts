import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SaleService } from '../services/sale.service';
import type { Sale, SaleFormInput } from '../models/sale.model';
import type { SaleFilter } from '../repositories/sale.repository.interface';

const saleService = new SaleService();
const SALES_QUERY_KEY = 'sales';

export const useSales = (filters?: SaleFilter) => {
  return useQuery({
    queryKey: [SALES_QUERY_KEY, filters],
    queryFn: () => saleService.getAll(filters),
  });
};

export const useSale = (id: string) => {
  return useQuery({
    queryKey: [SALES_QUERY_KEY, id],
    queryFn: () => saleService.getById(id),
    enabled: !!id,
  });
};

export const useCreateSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SaleFormInput) => saleService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SALES_QUERY_KEY] });
    },
  });
};

export const useUpdateSale = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SaleFormInput>) => saleService.update(id, data),
    onSuccess: (updatedSale) => {
      queryClient.invalidateQueries({ queryKey: [SALES_QUERY_KEY] });
      queryClient.setQueryData([SALES_QUERY_KEY, id], updatedSale);
    },
  });
};

export const useUpdateSaleStatus = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: Sale['status']) => saleService.updateStatus(id, status),
    onSuccess: (updatedSale) => {
      queryClient.invalidateQueries({ queryKey: [SALES_QUERY_KEY] });
      queryClient.setQueryData([SALES_QUERY_KEY, id], updatedSale);
    },
  });
};

export const useDeleteSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => saleService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SALES_QUERY_KEY] });
    },
  });
};