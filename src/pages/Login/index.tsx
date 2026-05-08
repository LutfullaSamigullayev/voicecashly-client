import { useTranslation } from 'react-i18next';
import { Mic, Languages, Zap, Globe } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { TelegramLoginButton } from '@/components/auth/TelegramLoginButton';
import { useTelegramLogin } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/useAuthStore';
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
  const login = useTelegramLogin();
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) return <Navigate to="/" replace />;

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
          {login.isPending ? (
            <p className="text-sm text-muted-foreground">{t('login.logging_in')}</p>
          ) : (
            <TelegramLoginButton botUsername={BOT_USERNAME} onAuth={login.mutate} />
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
