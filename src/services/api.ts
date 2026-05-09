import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/useAuthStore';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import i18n from '@/i18n';

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export const AUTH_LOGOUT_EVENT = 'voicecashly:auth-logout';

export const api = axios.create({
  baseURL,
  timeout: 60000,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  const wsId = useWorkspaceStore.getState().activeWorkspaceId;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (wsId) {
    config.headers['X-Workspace-Id'] = String(wsId);
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (error: AxiosError<{ message?: string }>) => {
    if (!error.response) {
      toast.error(i18n.t('toasts.no_internet'));
      return Promise.reject(error);
    }
    const status = error.response.status;
    if (status === 401) {
      const wasAuthenticated = useAuthStore.getState().isAuthenticated;
      useAuthStore.getState().logout();
      useWorkspaceStore.getState().reset();
      if (wasAuthenticated && window.location.pathname !== '/login') {
        window.dispatchEvent(new CustomEvent(AUTH_LOGOUT_EVENT));
      }
    } else if (status === 403) {
      toast.error(i18n.t('toasts.no_permission'));
    } else if (status >= 500) {
      toast.error(i18n.t('toasts.server_error'));
    }
    return Promise.reject(error);
  },
);
