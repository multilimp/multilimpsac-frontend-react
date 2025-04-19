
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createEntityId, createStatus } from '@/core/domain/types/value-objects';
import type { Quotation, QuotationFormInput } from '../models/quotation.model';
import type { QuotationFilter } from '../repositories/quotation.repository.interface';
import { QuotationService } from '../services/quotation.service';
import { toast } from 'sonner';

const quotationService = new QuotationService();
const QUOTATIONS_QUERY_KEY = 'quotations';

export const useQuotations = (filters?: QuotationFilter) => {
  return useQuery({
    queryKey: [QUOTATIONS_QUERY_KEY, filters],
    queryFn: () => quotationService.getAll(filters),
  });
};

export const useQuotation = (id: string) => {
  return useQuery({
    queryKey: [QUOTATIONS_QUERY_KEY, id],
    queryFn: () => quotationService.getById(createEntityId(id)),
    enabled: !!id,
  });
};

export const useCreateQuotation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: QuotationFormInput) => quotationService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUOTATIONS_QUERY_KEY] });
      toast.success('Cotización creada correctamente');
    },
    onError: (error: Error) => {
      toast.error('Error al crear la cotización: ' + error.message);
    }
  });
};

export const useUpdateQuotation = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<QuotationFormInput>) => 
      quotationService.update(createEntityId(id), data),
    onSuccess: (updatedQuotation) => {
      queryClient.invalidateQueries({ queryKey: [QUOTATIONS_QUERY_KEY] });
      queryClient.setQueryData([QUOTATIONS_QUERY_KEY, id], updatedQuotation);
      toast.success('Cotización actualizada correctamente');
    },
    onError: (error: Error) => {
      toast.error('Error al actualizar la cotización: ' + error.message);
    }
  });
};

export const useUpdateQuotationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      quotationService.updateStatus(createEntityId(id), createStatus(status)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUOTATIONS_QUERY_KEY] });
      toast.success('Estado de cotización actualizado correctamente');
    },
    onError: (error: Error) => {
      toast.error('Error al actualizar el estado: ' + error.message);
    }
  });
};

export const useDeleteQuotation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => quotationService.delete(createEntityId(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUOTATIONS_QUERY_KEY] });
      toast.success('Cotización eliminada correctamente');
    },
    onError: (error: Error) => {
      toast.error('Error al eliminar la cotización: ' + error.message);
    }
  });
};
