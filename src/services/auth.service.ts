import { api } from './api';
import type { AuthResponse, TelegramAuthData, User } from '@/types';

export const authService = {
  loginWithTelegram: async (data: TelegramAuthData): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/telegram', data);
    return res.data;
  },
  me: async (): Promise<User> => {
    const res = await api.get<User>('/auth/me');
    return res.data;
  },
};
