import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { budgetsService } from '@/services/budgets.service';
import type { Currency } from '@/types';

export function useBudgets(workspaceId: number | null, month?: number, year?: number) {
  return useQuery({
    queryKey: ['budgets', workspaceId, month, year],
    queryFn: () => budgetsService.findAll(workspaceId!, month, year),
    enabled: !!workspaceId,
  });
}

export function useBudgetProgress(workspaceId: number | null) {
  return useQuery({
    queryKey: ['budgets', 'progress', workspaceId],
    queryFn: () => budgetsService.progress(workspaceId!),
    enabled: !!workspaceId,
  });
}

export function useUpsertBudget() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: (input: {
      workspaceId: number;
      categoryId: number;
      amount: number;
      currency: Currency;
      month: number;
      year: number;
    }) => budgetsService.upsert(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast.success(t('toasts.saved'));
    },
  });
}
