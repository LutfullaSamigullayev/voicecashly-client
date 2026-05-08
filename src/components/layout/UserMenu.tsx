import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { LogOut, Settings as SettingsIcon, User as UserIcon, Repeat } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/store/useAuthStore';
import { useLogout } from '@/hooks/useAuth';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

export function UserMenu() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const logout = useLogout();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const initials = (user?.firstName ?? 'U').slice(0, 1).toUpperCase();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary hover:bg-primary/15">
            {initials}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="text-[11px] uppercase">
            {user?.firstName} {user?.lastName ?? ''}
            {user?.username && (
              <div className="mt-0.5 text-[10px] normal-case text-muted-foreground">
                @{user.username}
              </div>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/settings">
              <UserIcon className="h-3.5 w-3.5" />
              {t('user_menu.profile')}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/settings">
              <SettingsIcon className="h-3.5 w-3.5" />
              {t('user_menu.settings')}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Repeat className="h-3.5 w-3.5" />
            {t('user_menu.switch_ws')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setConfirmOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <LogOut className="h-3.5 w-3.5" />
            {t('user_menu.logout')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={t('toasts.logout_confirm')}
        destructive
        onConfirm={logout}
        confirmLabel={t('user_menu.logout')}
      />
    </>
  );
}
