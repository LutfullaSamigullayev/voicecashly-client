import { useTranslation } from 'react-i18next';
import { Globe, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserMenu } from './UserMenu';
import { useUiStore } from '@/store/useUiStore';
import { useUpdateSettings } from '@/hooks/useSettings';
import type { Lang } from '@/types';

const LANGS: { code: Lang; label: string }[] = [
  { code: 'uz', label: "O'zbekcha" },
  { code: 'ru', label: 'Русский' },
  { code: 'en', label: 'English' },
];

export function Topbar() {
  const { i18n } = useTranslation();
  const { theme, setTheme } = useUiStore();
  const updateSettings = useUpdateSettings();

  const handleChangeLang = (code: Lang) => {
    void i18n.changeLanguage(code);
    localStorage.setItem('lang', code);
    updateSettings.mutate({
      language: code.toUpperCase() as 'UZ' | 'RU' | 'EN',
    });
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-end gap-2 border-b border-border bg-card/80 px-4 backdrop-blur">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Globe className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {LANGS.map((l) => (
            <DropdownMenuItem key={l.code} onClick={() => handleChangeLang(l.code)}>
              {l.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>
      <UserMenu />
    </header>
  );
}
