import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Receipt,
  BarChart3,
  Tags,
  Users,
  Settings as SettingsIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';
import { useActiveWorkspace } from '@/hooks/useWorkspaces';

export function Sidebar() {
  const { t } = useTranslation();
  const active = useActiveWorkspace();
  const isTeam = active && !active.workspace.isPersonal;

  const items = [
    { to: '/', label: t('nav.overview'), icon: LayoutDashboard, end: true },
    { to: '/transactions', label: t('nav.transactions'), icon: Receipt },
    { to: '/analytics', label: t('nav.analytics'), icon: BarChart3 },
    { to: '/categories', label: t('nav.categories'), icon: Tags },
    ...(isTeam ? [{ to: '/team', label: t('nav.team'), icon: Users }] : []),
    { to: '/settings', label: t('nav.settings'), icon: SettingsIcon },
  ];

  return (
    <aside className="hidden h-screen w-[220px] flex-col border-r border-border bg-card md:flex">
      <div className="flex h-14 items-center gap-2 border-b border-border px-4">
        <img src="/logo.svg" alt="VoiceCashly" className="h-7 w-7" />
        <span className="text-base font-medium">VoiceCashly</span>
      </div>
      <div className="border-b border-border p-3">
        <WorkspaceSwitcher />
      </div>
      <nav className="flex-1 space-y-0.5 p-2">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-foreground/70 hover:bg-accent hover:text-foreground',
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-border p-3 text-xs text-muted-foreground">
        VoiceCashly · v0.1
      </div>
    </aside>
  );
}
