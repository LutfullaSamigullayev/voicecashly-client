import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { useAuthStore } from '@/store/useAuthStore';
import { useSettings, useUpdateSettings } from '@/hooks/useSettings';
import {
  useActiveWorkspace,
  useDeleteWorkspace,
  useRenameWorkspace,
} from '@/hooks/useWorkspaces';
import type { Currency, Lang } from '@/types';

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const active = useActiveWorkspace();
  const isOwnerOrAdmin = active && (active.role === 'OWNER' || active.role === 'ADMIN');
  const isOwner = active?.role === 'OWNER';
  const { data: settings } = useSettings();
  const update = useUpdateSettings();
  const renameWs = useRenameWorkspace();
  const deleteWs = useDeleteWorkspace();

  const [defaultCurrency, setDefaultCurrency] = useState<Currency>('UZS');
  const [language, setLanguage] = useState<'UZ' | 'RU' | 'EN'>('UZ');
  const [wsName, setWsName] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Sozlamalar serverdan async keladi — kelganda formani sinxronlaymiz,
  // aks holda Save default qiymatlar bilan haqiqiy sozlamalarni yozib yuboradi
  useEffect(() => {
    if (!settings) return;
    setDefaultCurrency(settings.defaultCurrency);
    setLanguage(settings.language);
  }, [settings]);

  useEffect(() => {
    setWsName(active?.workspace.name ?? '');
  }, [active?.workspace.name]);

  const saveGeneral = () => {
    update.mutate({ defaultCurrency, language });
    void i18n.changeLanguage(language.toLowerCase() as Lang);
    localStorage.setItem('lang', language.toLowerCase());
  };

  const saveWorkspaceName = () => {
    if (!active || !wsName.trim()) return;
    renameWs.mutate({ id: active.workspaceId, name: wsName.trim() });
  };

  const confirmDeleteWorkspace = () => {
    if (!active) return;
    deleteWs.mutate(active.workspaceId, {
      onSuccess: () => navigate('/'),
    });
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-medium">{t('settings.title')}</h1>
      <Tabs defaultValue="profile" orientation="vertical" className="flex flex-col gap-4 md:flex-row">
        <TabsList className="flex h-auto flex-col items-stretch md:w-48">
          <TabsTrigger value="profile" className="justify-start">
            {t('settings.tab_profile')}
          </TabsTrigger>
          <TabsTrigger value="general" className="justify-start">
            {t('settings.tab_general')}
          </TabsTrigger>
          {isOwnerOrAdmin && (
            <TabsTrigger value="workspace" className="justify-start">
              {t('settings.tab_workspace')}
            </TabsTrigger>
          )}
          <TabsTrigger value="sessions" className="justify-start">
            {t('settings.tab_sessions')}
          </TabsTrigger>
        </TabsList>

        <div className="flex-1">
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>{t('settings.tab_profile')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">{t('settings.first_name')}</Label>
                  <Input value={user?.firstName ?? ''} readOnly />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">{t('settings.username')}</Label>
                  <Input value={user?.username ? `@${user.username}` : ''} readOnly />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>{t('settings.tab_general')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label className="text-xs">{t('settings.default_currency')}</Label>
                  <Select
                    value={defaultCurrency}
                    onValueChange={(v) => setDefaultCurrency(v as Currency)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UZS">UZS</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">{t('settings.language')}</Label>
                  <Select
                    value={language}
                    onValueChange={(v) => setLanguage(v as 'UZ' | 'RU' | 'EN')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UZ">O'zbekcha</SelectItem>
                      <SelectItem value="RU">Русский</SelectItem>
                      <SelectItem value="EN">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={saveGeneral} disabled={update.isPending}>
                  {t('common.save')}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {isOwnerOrAdmin && (
            <TabsContent value="workspace">
              <Card>
                <CardHeader>
                  <CardTitle>{t('settings.tab_workspace')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Label className="text-xs">{t('settings.ws_name')}</Label>
                    <div className="flex gap-2">
                      <Input value={wsName} onChange={(e) => setWsName(e.target.value)} />
                      <Button
                        onClick={saveWorkspaceName}
                        disabled={
                          renameWs.isPending ||
                          !wsName.trim() ||
                          wsName.trim() === active?.workspace.name
                        }
                      >
                        {t('common.save')}
                      </Button>
                    </div>
                  </div>
                  {isOwner && (
                    <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3">
                      <p className="text-xs text-muted-foreground">
                        {t('settings.ws_delete_warn')}
                      </p>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="mt-2"
                        onClick={() => setDeleteOpen(true)}
                      >
                        {t('team.delete_workspace')}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="sessions">
            <Card>
              <CardHeader>
                <CardTitle>{t('settings.tab_sessions')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">—</p>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={t('team.delete_confirm')}
        description={t('settings.ws_delete_warn')}
        destructive
        onConfirm={confirmDeleteWorkspace}
        confirmLabel={t('common.delete')}
      />
    </div>
  );
}
