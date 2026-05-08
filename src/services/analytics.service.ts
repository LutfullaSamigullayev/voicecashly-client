import { api } from './api';
import type { MonthlyPoint, CategoryBreakdownItem, TxType } from '@/types';

export const analyticsService = {
  monthly: async (workspaceId: number, months = 6): Promise<MonthlyPoint[]> => {
    const res = await api.get<MonthlyPoint[]>('/analytics/monthly', {
      params: { workspaceId, months },
    });
    return res.data;
  },
  byCategory: async (
    workspaceId: number,
    type: TxType,
    from?: string,
    to?: string,
  ): Promise<CategoryBreakdownItem[]> => {
    const res = await api.get<CategoryBreakdownItem[]>('/analytics/by-category', {
      params: { workspaceId, type, from, to },
    });
    return res.data;
  },
};
