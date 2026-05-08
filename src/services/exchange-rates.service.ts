import { api } from './api';
import type { ExchangeRate } from '@/types';

export const exchangeRatesService = {
  latest: async (): Promise<ExchangeRate[]> => {
    const res = await api.get<ExchangeRate[]>('/exchange-rates/latest');
    return res.data;
  },
};
