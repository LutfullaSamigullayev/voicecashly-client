import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Mic, Languages, Zap, Globe } from 'lucide-react';
import { Navigate, useSearchParams } from 'react-router-dom';
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
import type { Lang, TelegramAuthData } from '@/types';

const BOT_USERNAME = import.meta.env.VITE_BOT_USERNAME ?? 'VoiceCashlyBot';
const BOT_ID = import.meta.env.VITE_BOT_ID ?? '';
const LANGS: { code: Lang; label: string }[] = [
  { code: 'uz', label: "O'zbekcha" },
  { code: 'ru', label: 'Русский' },
  { code: 'en', label: 'English' },
];

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const login = useTelegramLogin();
  const { isAuthenticated } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const handledRef = useRef(false);

  const authUrl = `${window.location.origin}/login`;

  useEffect(() => {
    if (handledRef.current) return;
    const id = searchParams.get('id');
    const hash = searchParams.get('hash');
    const authDate = searchParams.get('auth_date');
    const firstName = searchParams.get('first_name');
    if (!id || !hash || !authDate || !firstName) return;

    handledRef.current = true;
    const payload: TelegramAuthData = {
      id: Number(id),
      first_name: firstName,
      last_name: searchParams.get('last_name') ?? undefined,
      username: searchParams.get('username') ?? undefined,
      photo_url: searchParams.get('photo_url') ?? undefined,
      auth_date: Number(authDate),
      hash,
    };
    login.mutate(payload);
    setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams, login]);

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
          ) : BOT_ID ? (
            <TelegramLoginButton
              botId={BOT_ID}
              authUrl={authUrl}
              label={t('login.telegram_button', { defaultValue: 'Log in with Telegram' })}
            />
          ) : (
            <p className="text-sm text-destructive">VITE_BOT_ID env var is missing</p>
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
