import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analytics.service';
import type { TxType } from '@/types';

export function useMonthlyAnalytics(workspaceId: number | null, months = 6) {
  return useQuery({
    queryKey: ['analytics', 'monthly', workspaceId, months],
    queryFn: () => analyticsService.monthly(workspaceId!, months),
    enabled: !!workspaceId,
  });
}

export function useByCategoryAnalytics(
  workspaceId: number | null,
  type: TxType = 'EXPENSE',
  from?: string,
  to?: string,
) {
  return useQuery({
    queryKey: ['analytics', 'by-category', workspaceId, type, from, to],
    queryFn: () => analyticsService.byCategory(workspaceId!, type, from, to),
    enabled: !!workspaceId,
  });
}
