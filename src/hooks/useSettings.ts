import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { settingsService } from '@/services/settings.service';
import { useAuthStore } from '@/store/useAuthStore';
import type { Currency } from '@/types';

export function useSettings() {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsService.get(),
    enabled: isAuthenticated,
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: (input: {
      defaultCurrency?: Currency;
      language?: 'UZ' | 'RU' | 'EN';
      timezone?: string;
      notifyBudget?: boolean;
      notifyRecurring?: boolean;
    }) => settingsService.update(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success(t('toasts.saved'));
    },
  });
}
