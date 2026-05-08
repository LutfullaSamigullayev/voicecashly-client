import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { transactionsService, type CreateTransactionInput, type TransactionFilters } from '@/services/transactions.service';

export function useTransactions(filters: TransactionFilters | null) {
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => transactionsService.findAll(filters!),
    enabled: !!filters?.workspaceId,
  });
}

export function useSummary(workspaceId: number | null, from?: string, to?: string) {
  return useQuery({
    queryKey: ['summary', workspaceId, from, to],
    queryFn: () => transactionsService.summary(workspaceId!, from, to),
    enabled: !!workspaceId,
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: (input: CreateTransactionInput) => transactionsService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      toast.success(t('toasts.saved'));
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: Partial<CreateTransactionInput> }) =>
      transactionsService.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
      toast.success(t('toasts.saved'));
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: (id: number) => transactionsService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
      toast.success(t('toasts.deleted'));
    },
  });
}
