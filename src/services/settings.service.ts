import { api } from './api';
import type { UserSettings, Currency } from '@/types';

export const settingsService = {
  get: async (): Promise<UserSettings | null> => {
    const res = await api.get<UserSettings | null>('/settings');
    return res.data;
  },
  update: async (input: {
    defaultCurrency?: Currency;
    language?: 'UZ' | 'RU' | 'EN';
    timezone?: string;
    notifyBudget?: boolean;
    notifyRecurring?: boolean;
  }): Promise<UserSettings> => {
    const res = await api.patch<UserSettings>('/settings', input);
    return res.data;
  },
};
