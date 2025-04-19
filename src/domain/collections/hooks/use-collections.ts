import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CollectionService } from '../services/collection.service';
import type { Collection, CollectionFormInput, Payment } from '../models/collection.model';
import type { CollectionFilter } from '../repositories/collection.repository.interface';

const collectionService = new CollectionService();
const COLLECTIONS_QUERY_KEY = 'collections';

export const useCollections = (filters?: CollectionFilter) => {
  return useQuery({
    queryKey: [COLLECTIONS_QUERY_KEY, filters],
    queryFn: () => collectionService.getAll(filters),
  });
};

export const useCollection = (id: string) => {
  return useQuery({
    queryKey: [COLLECTIONS_QUERY_KEY, id],
    queryFn: () => collectionService.getById(id),
    enabled: !!id,
  });
};

export const useCreateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CollectionFormInput) => collectionService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS_QUERY_KEY] });
    },
  });
};

export const useUpdateCollection = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CollectionFormInput>) => collectionService.update(id, data),
    onSuccess: (updatedCollection) => {
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS_QUERY_KEY] });
      queryClient.setQueryData([COLLECTIONS_QUERY_KEY, id], updatedCollection);
    },
  });
};

export const useUpdateCollectionStatus = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: Collection['status']) => collectionService.updateStatus(id, status),
    onSuccess: (updatedCollection) => {
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS_QUERY_KEY] });
      queryClient.setQueryData([COLLECTIONS_QUERY_KEY, id], updatedCollection);
    },
  });
};

export const useAddPayment = (collectionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payment: Omit<Payment, 'id' | 'collectionId' | 'createdAt' | 'createdBy'>) =>
      collectionService.addPayment(collectionId, payment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS_QUERY_KEY, collectionId] });
    },
  });
};

export const useUpdatePayment = (collectionId: string, paymentId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payment: Partial<Omit<Payment, 'id' | 'collectionId' | 'createdAt' | 'createdBy'>>) =>
      collectionService.updatePayment(collectionId, paymentId, payment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS_QUERY_KEY, collectionId] });
    },
  });
};

export const useDeletePayment = (collectionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentId: string) => collectionService.deletePayment(collectionId, paymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS_QUERY_KEY, collectionId] });
    },
  });
};

export const useDeleteCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => collectionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS_QUERY_KEY] });
    },
  });
};