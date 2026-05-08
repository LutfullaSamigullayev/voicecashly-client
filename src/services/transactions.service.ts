import { api } from './api';
import type { Transaction, TransactionsList, Summary, Currency, TxType } from '@/types';

export interface TransactionFilters {
  workspaceId: number;
  type?: TxType;
  categoryId?: number;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface CreateTransactionInput {
  workspaceId: number;
  amount: number;
  currency?: Currency;
  type: TxType;
  categoryId: number;
  note?: string;
  date?: string;
}

export const transactionsService = {
  findAll: async (filters: TransactionFilters): Promise<TransactionsList> => {
    const res = await api.get<TransactionsList>('/transactions', { params: filters });
    return res.data;
  },
  summary: async (workspaceId: number, from?: string, to?: string): Promise<Summary> => {
    const res = await api.get<Summary>('/transactions/summary', {
      params: { workspaceId, from, to },
    });
    return res.data;
  },
  create: async (input: CreateTransactionInput): Promise<Transaction> => {
    const res = await api.post<Transaction>('/transactions', input);
    return res.data;
  },
  update: async (id: number, input: Partial<CreateTransactionInput>): Promise<Transaction> => {
    const res = await api.patch<Transaction>(`/transactions/${id}`, input);
    return res.data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/transactions/${id}`);
  },
  exportCsv: async (workspaceId: number, from?: string, to?: string): Promise<Blob> => {
    const res = await api.get('/transactions/export', {
      params: { workspaceId, from, to },
      responseType: 'blob',
    });
    return res.data as Blob;
  },
};
