import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mic, Languages, Zap, Globe, Send, Loader2 } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/useAuthStore';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Lang } from '@/types';

const BOT_USERNAME = import.meta.env.VITE_BOT_USERNAME ?? 'VoiceCashlyBot';
const LANGS: { code: Lang; label: string }[] = [
  { code: 'uz', label: "O'zbekcha" },
  { code: 'ru', label: 'Русский' },
  { code: 'en', label: 'English' },
];

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, login } = useAuthStore();
  const { setActive } = useWorkspaceStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [token, setToken] = useState<string | null>(null);

  const start = useMutation({
    mutationFn: () => authService.botAuthStart(),
    onSuccess: (data) => {
      setToken(data.token);
      window.open(data.deepLink, '_blank', 'noopener,noreferrer');
    },
    onError: () => {
      toast.error(t('toasts.server_error'));
    },
  });

  const poll = useQuery({
    queryKey: ['bot-auth-check', token],
    queryFn: () => authService.botAuthCheck(token!),
    enabled: !!token,
    refetchInterval: (q) => {
      const data = q.state.data;
      if (!data || data.status === 'pending') return 2000;
      return false;
    },
  });

  useEffect(() => {
    const data = poll.data;
    if (!data) return;

    if (data.status === 'confirmed' && data.jwt && data.user) {
      login(data.jwt, data.user);
      const memberships = data.user.workspaces ?? [];
      const preferred = data.activeWorkspaceId
        ? memberships.find((m) => m.workspaceId === data.activeWorkspaceId)
        : undefined;
      const ws = preferred ?? memberships[0];
      if (ws) setActive(ws.workspaceId, ws.role);
      queryClient.invalidateQueries();
      navigate('/');
    } else if (data.status === 'expired') {
      toast.error(t('login.expired'));
      setToken(null);
    }
  }, [poll.data, login, setActive, queryClient, navigate, t]);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const isWaiting = !!token && poll.data?.status === 'pending';

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4">
      <div className="absolute right-4 top-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Globe className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {LANGS.map((l) => (
              <DropdownMenuItem
                key={l.code}
                onClick={() => {
                  void i18n.changeLanguage(l.code);
                  localStorage.setItem('lang', l.code);
                }}
              >
                {l.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <img src="/logo.svg" alt="" className="h-16 w-16" />
          <div>
            <h1 className="text-2xl font-medium tracking-tight">{t('login.welcome')}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{t('login.subtitle')}</p>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          {isWaiting ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-sm font-medium">{t('login.waiting_confirm')}</p>
              <p className="text-xs text-muted-foreground">{t('login.open_bot_hint')}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setToken(null)}
                className="mt-2"
              >
                {t('login.cancel')}
              </Button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => start.mutate()}
              disabled={start.isPending}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#54a9eb] px-5 text-sm font-medium text-white shadow-sm transition hover:bg-[#3d97e0] disabled:opacity-60"
            >
              {start.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {t('login.bot_login_button')}
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-muted-foreground">
            <Mic className="h-3 w-3" /> {t('login.feature_voice')}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-muted-foreground">
            <Languages className="h-3 w-3" /> {t('login.feature_ai')}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-muted-foreground">
            <Zap className="h-3 w-3" /> {t('login.feature_realtime')}
          </span>
        </div>

        <p className="text-xs text-muted-foreground">
          {t('login.footer', { bot: BOT_USERNAME })}
        </p>
      </div>
    </div>
  );
}
