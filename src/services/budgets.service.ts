import { api } from './api';
import type { Budget, BudgetProgress, Currency } from '@/types';

export const budgetsService = {
  findAll: async (workspaceId: number, month?: number, year?: number): Promise<Budget[]> => {
    const res = await api.get<Budget[]>('/budgets', { params: { workspaceId, month, year } });
    return res.data;
  },
  progress: async (workspaceId: number): Promise<BudgetProgress[]> => {
    const res = await api.get<BudgetProgress[]>('/budgets/progress', { params: { workspaceId } });
    return res.data;
  },
  upsert: async (input: {
    workspaceId: number;
    categoryId: number;
    amount: number;
    currency: Currency;
    month: number;
    year: number;
  }): Promise<Budget> => {
    const res = await api.post<Budget>('/budgets', input);
    return res.data;
  },
};
