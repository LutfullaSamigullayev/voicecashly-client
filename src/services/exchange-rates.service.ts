import { api } from './api';
import type { ExchangeRate } from '@/types';

export const exchangeRatesService = {
  // Backend bitta eng so'nggi kurs yozuvini (yoki null) qaytaradi
  latest: async (): Promise<ExchangeRate | null> => {
    const res = await api.get<ExchangeRate | null>('/exchange-rates/latest');
    return res.data;
  },
};
