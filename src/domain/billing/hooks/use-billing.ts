
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BillingService } from '../services/billing.service';
import type { Invoice, InvoiceFormInput } from '../models/billing.model';
import type { InvoiceFilter } from '../repositories/billing.repository.interface';

const billingService = new BillingService();
const INVOICES_QUERY_KEY = 'invoices';

export const useInvoices = (filters?: InvoiceFilter) => {
  return useQuery({
    queryKey: [INVOICES_QUERY_KEY, filters],
    queryFn: () => billingService.getAll(filters),
  });
};

export const useInvoice = (id: string) => {
  return useQuery({
    queryKey: [INVOICES_QUERY_KEY, id],
    queryFn: () => billingService.getById(id),
    enabled: !!id,
  });
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InvoiceFormInput) => billingService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INVOICES_QUERY_KEY] });
    },
  });
};

export const useUpdateInvoice = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<InvoiceFormInput>) => billingService.update(id, data),
    onSuccess: (updatedInvoice) => {
      queryClient.invalidateQueries({ queryKey: [INVOICES_QUERY_KEY] });
      queryClient.setQueryData([INVOICES_QUERY_KEY, id], updatedInvoice);
    },
  });
};

export const useUpdateInvoiceStatus = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: Invoice['status']) => billingService.updateStatus(id, status),
    onSuccess: (updatedInvoice) => {
      queryClient.invalidateQueries({ queryKey: [INVOICES_QUERY_KEY] });
      queryClient.setQueryData([INVOICES_QUERY_KEY, id], updatedInvoice);
    },
  });
};

export const useUpdateInvoicePaymentStatus = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: Invoice['paymentStatus']) => billingService.updatePaymentStatus(id, status),
    onSuccess: (updatedInvoice) => {
      queryClient.invalidateQueries({ queryKey: [INVOICES_QUERY_KEY] });
      queryClient.setQueryData([INVOICES_QUERY_KEY, id], updatedInvoice);
    },
  });
};

export const useVoidInvoice = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => billingService.void(id),
    onSuccess: (voidedInvoice) => {
      queryClient.invalidateQueries({ queryKey: [INVOICES_QUERY_KEY] });
      queryClient.setQueryData([INVOICES_QUERY_KEY, id], voidedInvoice);
    },
  });
};

export const useGenerateElectronicBilling = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => billingService.generateElectronicBilling(id),
    onSuccess: (updatedInvoice) => {
      queryClient.invalidateQueries({ queryKey: [INVOICES_QUERY_KEY] });
      queryClient.setQueryData([INVOICES_QUERY_KEY, id], updatedInvoice);
    },
  });
};

export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => billingService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INVOICES_QUERY_KEY] });
    },
  });
};
