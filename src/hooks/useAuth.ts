import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/useAuthStore';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import type { TelegramAuthData } from '@/types';

export function useTelegramLogin() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { setActive } = useWorkspaceStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TelegramAuthData) => authService.loginWithTelegram(data),
    onSuccess: (res) => {
      login(res.token, res.user);
      const ws = res.user.workspaces?.[0];
      if (ws) setActive(ws.workspaceId, ws.role);
      queryClient.invalidateQueries();
      navigate('/');
    },
  });
}

export function useMe() {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => authService.me(),
    enabled: isAuthenticated,
  });
}

export function useLogout() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { reset } = useWorkspaceStore();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return () => {
    logout();
    reset();
    queryClient.clear();
    navigate('/login');
    toast.success(t('toasts.logout_bye'));
  };
}
