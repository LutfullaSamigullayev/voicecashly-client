import { api } from './api';
import type { AuthResponse, TelegramAuthData, User } from '@/types';

export interface BotAuthStart {
  token: string;
  deepLink: string;
  expiresAt: string;
}

export interface BotAuthCheck {
  status: 'pending' | 'confirmed' | 'expired';
  jwt?: string;
  user?: User;
}

export const authService = {
  loginWithTelegram: async (data: TelegramAuthData): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/telegram', data);
    return res.data;
  },
  me: async (): Promise<User> => {
    const res = await api.get<User>('/auth/me');
    return res.data;
  },
  botAuthStart: async (): Promise<BotAuthStart> => {
    const res = await api.post<BotAuthStart>('/auth/bot/start');
    return res.data;
  },
  botAuthCheck: async (token: string): Promise<BotAuthCheck> => {
    const res = await api.get<BotAuthCheck>('/auth/bot/check', { params: { token } });
    return res.data;
  },
};
