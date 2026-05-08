import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import { useCategories } from '@/hooks/useCategories';
import { useCreateTransaction } from '@/hooks/useTransactions';
import { useActiveWorkspace } from '@/hooks/useWorkspaces';
import type { Currency, Lang, TxType } from '@/types';

export function QuickAddForm() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language?.slice(0, 2) ?? 'uz') as Lang;
  const active = useActiveWorkspace();
  const wsId = active?.workspaceId ?? null;
  const { data: categories } = useCategories(wsId);
  const create = useCreateTransaction();

  const [type, setType] = useState<TxType>('EXPENSE');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<Currency>('UZS');
  const [categoryId, setCategoryId] = useState<string>('');
  const [note, setNote] = useState('');

  const filteredCats = (categories ?? []).filter(
    (c) => c.type === type || c.type === 'BOTH',
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wsId || !categoryId || !amount) return;
    create.mutate(
      {
        workspaceId: wsId,
        amount: Number(amount),
        currency,
        type,
        categoryId: Number(categoryId),
        note: note || undefined,
      },
      {
        onSuccess: () => {
          setAmount('');
          setNote('');
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('overview.quick_add')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setType('EXPENSE')}
              className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                type === 'EXPENSE'
                  ? 'border-expense bg-expense-bg text-expense'
                  : 'border-border bg-background'
              }`}
            >
              {t('transactions.expense')}
            </button>
            <button
              type="button"
              onClick={() => setType('INCOME')}
              className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                type === 'INCOME'
                  ? 'border-income bg-income-bg text-income'
                  : 'border-border bg-background'
              }`}
            >
              {t('transactions.income')}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2 space-y-1">
              <Label className="text-xs">{t('transactions.amount')}</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                inputMode="decimal"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">{t('transactions.filter_currency')}</Label>
              <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UZS">UZS</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">{t('transactions.category')}</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="—" />
              </SelectTrigger>
              <SelectContent>
                {filteredCats.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {lang === 'uz' ? c.nameUz : lang === 'ru' ? c.nameRu : c.nameEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">{t('transactions.note')}</Label>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t('transactions.note_placeholder')}
            />
          </div>

          <Button type="submit" disabled={create.isPending} className="w-full">
            {t('common.save')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
