import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import { useAuthStore } from '@/store/useAuthStore';
import { useSettings, useUpdateSettings } from '@/hooks/useSettings';
import { useActiveWorkspace } from '@/hooks/useWorkspaces';
import type { Currency, Lang } from '@/types';

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { user } = useAuthStore();
  const active = useActiveWorkspace();
  const isOwnerOrAdmin = active && (active.role === 'OWNER' || active.role === 'ADMIN');
  const isOwner = active?.role === 'OWNER';
  const { data: settings } = useSettings();
  const update = useUpdateSettings();

  const [defaultCurrency, setDefaultCurrency] = useState<Currency>(
    settings?.defaultCurrency ?? 'UZS',
  );
  const [language, setLanguage] = useState<'UZ' | 'RU' | 'EN'>(
    settings?.language ?? 'UZ',
  );

  const saveGeneral = () => {
    update.mutate({ defaultCurrency, language });
    void i18n.changeLanguage(language.toLowerCase() as Lang);
    localStorage.setItem('lang', language.toLowerCase());
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
                    <Input defaultValue={active?.workspace.name ?? ''} />
                  </div>
                  {isOwner && (
                    <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3">
                      <p className="text-xs text-muted-foreground">
                        {t('settings.ws_delete_warn')}
                      </p>
                      <Button variant="destructive" size="sm" className="mt-2">
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
    </div>
  );
}
