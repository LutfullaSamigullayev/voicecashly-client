import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, ChevronsUpDown, Plus, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useMyWorkspaces, useActiveWorkspace, useCreateWorkspace } from '@/hooks/useWorkspaces';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function WorkspaceSwitcher() {
  const { t } = useTranslation();
  const { data: memberships } = useMyWorkspaces();
  const active = useActiveWorkspace();
  const { setActive } = useWorkspaceStore();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<'personal' | 'team'>('personal');
  const [name, setName] = useState('');
  const createWs = useCreateWorkspace();

  const handleCreate = () => {
    createWs.mutate(
      { name: type === 'team' ? name || 'Team' : '', type },
      {
        onSuccess: () => {
          setOpen(false);
          setName('');
        },
      },
    );
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex w-full items-center gap-2 rounded-md border border-border bg-background px-2 py-2 text-left text-sm hover:bg-accent">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
              {active?.workspace.isPersonal ? (
                <User className="h-3.5 w-3.5" />
              ) : (
                <Building2 className="h-3.5 w-3.5" />
              )}
            </div>
            <div className="flex-1 truncate">
              <div className="truncate font-medium">{active?.workspace.name ?? '—'}</div>
              <div className="text-[10px] uppercase text-muted-foreground">
                {active?.role ?? ''}
              </div>
            </div>
            <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>{t('workspace.switcher')}</DropdownMenuLabel>
          {memberships?.map((m) => (
            <DropdownMenuItem
              key={m.workspaceId}
              onClick={() => setActive(m.workspaceId, m.role)}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-secondary">
                {m.workspace.isPersonal ? (
                  <User className="h-3 w-3" />
                ) : (
                  <Building2 className="h-3 w-3" />
                )}
              </span>
              <span className="flex-1 truncate">{m.workspace.name}</span>
              <Badge variant="outline" className="text-[9px]">
                {m.role}
              </Badge>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Plus className="h-3.5 w-3.5" />
            {t('workspace.create')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('workspace.create')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setType('personal')}
                className={`rounded-md border p-3 text-left text-sm ${
                  type === 'personal' ? 'border-primary bg-primary/5' : 'border-border'
                }`}
              >
                <User className="mb-1 h-4 w-4" />
                {t('workspace.create_personal')}
              </button>
              <button
                onClick={() => setType('team')}
                className={`rounded-md border p-3 text-left text-sm ${
                  type === 'team' ? 'border-primary bg-primary/5' : 'border-border'
                }`}
              >
                <Building2 className="mb-1 h-4 w-4" />
                {t('workspace.create_team')}
              </button>
            </div>
            {type === 'team' && (
              <div className="space-y-1">
                <Label>{t('workspace.team_name')}</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleCreate} disabled={createWs.isPending}>
              {t('common.create')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
