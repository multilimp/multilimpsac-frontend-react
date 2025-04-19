import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TreasuryService } from '../services/treasury.service';
import type { Transaction, Account, TransactionFormInput } from '../models/treasury.model';
import type { TransactionFilter } from '../repositories/treasury.repository.interface';

const treasuryService = new TreasuryService();
const TREASURY_QUERY_KEY = 'treasury';
const ACCOUNTS_QUERY_KEY = 'accounts';

// Hooks para transacciones
export const useTransactions = (filters?: TransactionFilter) => {
  return useQuery({
    queryKey: [TREASURY_QUERY_KEY, 'transactions', filters],
    queryFn: () => treasuryService.getAllTransactions(filters),
  });
};

export const useTransaction = (id: string) => {
  return useQuery({
    queryKey: [TREASURY_QUERY_KEY, 'transaction', id],
    queryFn: () => treasuryService.getTransactionById(id),
    enabled: !!id,
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TransactionFormInput) => treasuryService.createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TREASURY_QUERY_KEY, 'transactions'] });
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_QUERY_KEY] }); // Invalida las cuentas ya que los balances cambian
    },
  });
};

export const useUpdateTransaction = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<TransactionFormInput>) => treasuryService.updateTransaction(id, data),
    onSuccess: (updatedTransaction) => {
      queryClient.invalidateQueries({ queryKey: [TREASURY_QUERY_KEY, 'transactions'] });
      queryClient.setQueryData([TREASURY_QUERY_KEY, 'transaction', id], updatedTransaction);
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_QUERY_KEY] });
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => treasuryService.deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TREASURY_QUERY_KEY, 'transactions'] });
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_QUERY_KEY] });
    },
  });
};

// Hooks para cuentas
export const useAccounts = () => {
  return useQuery({
    queryKey: [ACCOUNTS_QUERY_KEY],
    queryFn: () => treasuryService.getAllAccounts(),
  });
};

export const useAccount = (id: string) => {
  return useQuery({
    queryKey: [ACCOUNTS_QUERY_KEY, id],
    queryFn: () => treasuryService.getAccountById(id),
    enabled: !!id,
  });
};

export const useCreateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Account, 'id' | 'balance' | 'createdAt' | 'updatedAt'>) => 
      treasuryService.createAccount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_QUERY_KEY] });
    },
  });
};

export const useUpdateAccount = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Omit<Account, 'id' | 'balance' | 'createdAt' | 'updatedAt'>>) => 
      treasuryService.updateAccount(id, data),
    onSuccess: (updatedAccount) => {
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_QUERY_KEY] });
      queryClient.setQueryData([ACCOUNTS_QUERY_KEY, id], updatedAccount);
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => treasuryService.deleteAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_QUERY_KEY] });
    },
  });
};