import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Send, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { EmptyState } from '@/components/shared/EmptyState';
import { useActiveWorkspace, useInviteCode, useWorkspaceDetail } from '@/hooks/useWorkspaces';
import { formatDate } from '@/lib/format';
import type { Lang } from '@/types';

const BOT_USERNAME = import.meta.env.VITE_BOT_USERNAME ?? 'VoiceCashlyBot';

export default function TeamPage() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language?.slice(0, 2) ?? 'uz') as Lang;
  const active = useActiveWorkspace();
  const wsId = active?.workspaceId ?? null;
  const isOwner = active?.role === 'OWNER';
  const isPersonal = active?.workspace.isPersonal ?? true;

  const { data: ws } = useWorkspaceDetail(wsId);
  const { data: inviteCode } = useInviteCode(isOwner && !isPersonal ? wsId : null);
  const [inviteOpen, setInviteOpen] = useState(false);

  if (isPersonal) {
    return <EmptyState title={t('team.personal_no_team')} />;
  }

  const inviteLink = inviteCode
    ? `https://t.me/${BOT_USERNAME}?start=join_${inviteCode}`
    : '';

  const copyLink = async () => {
    if (!inviteLink) return;
    await navigator.clipboard.writeText(inviteLink);
    toast.success(t('team.copied'));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium">{t('team.title')}</h1>
        {isOwner && (
          <Button onClick={() => setInviteOpen(true)}>
            <Plus className="h-4 w-4" />
            {t('team.invite')}
          </Button>
        )}
      </div>

      {ws?.members && ws.members.length > 0 ? (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('team.name')}</TableHead>
                <TableHead>{t('team.username')}</TableHead>
                <TableHead>{t('team.role')}</TableHead>
                <TableHead>{t('team.joined')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ws.members.map((m) => {
                const initials = (m.user?.firstName ?? '?').slice(0, 1).toUpperCase();
                return (
                  <TableRow key={m.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                          {initials}
                        </span>
                        <span>
                          {m.user?.firstName} {m.user?.lastName ?? ''}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {m.user?.username ? `@${m.user.username}` : '—'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{m.role}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(m.joinedAt, 'd MMM yyyy', lang)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <EmptyState title={t('team.no_members')} />
      )}

      {isOwner && (
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">{t('team.delete_zone')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="destructive">{t('team.delete_workspace')}</Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('team.invite_link')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="rounded-md border border-border bg-muted/10 p-3 text-xs break-all">
              {inviteLink || '...'}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={copyLink} className="flex-1">
                <Copy className="h-4 w-4" />
                {t('team.copy_link')}
              </Button>
              <Button asChild className="flex-1">
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(inviteLink)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Send className="h-4 w-4" />
                  {t('team.share_telegram')}
                </a>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
