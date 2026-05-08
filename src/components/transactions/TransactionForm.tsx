import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
import type { Currency, Lang, Transaction, TxType } from '@/types';

export interface TransactionFormValue {
  amount: number;
  currency: Currency;
  type: TxType;
  categoryId: number;
  note?: string;
  date?: string;
}

interface Props {
  workspaceId: number;
  initial?: Transaction;
  onSubmit: (v: TransactionFormValue) => void;
  isPending?: boolean;
}

export function TransactionForm({ workspaceId, initial, onSubmit, isPending }: Props) {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language?.slice(0, 2) ?? 'uz') as Lang;
  const { data: categories } = useCategories(workspaceId);

  const [type, setType] = useState<TxType>(initial?.type ?? 'EXPENSE');
  const [amount, setAmount] = useState(initial ? String(initial.amount) : '');
  const [currency, setCurrency] = useState<Currency>(initial?.currency ?? 'UZS');
  const [categoryId, setCategoryId] = useState<string>(
    initial ? String(initial.categoryId) : '',
  );
  const [note, setNote] = useState<string>(
    (lang === 'uz'
      ? initial?.noteUz
      : lang === 'ru'
        ? initial?.noteRu
        : initial?.noteEn) ?? '',
  );
  const [date, setDate] = useState<string>(
    initial?.date ? new Date(initial.date).toISOString().slice(0, 16) : '',
  );

  useEffect(() => {
    if (initial) setType(initial.type);
  }, [initial]);

  const filtered = (categories ?? []).filter(
    (c) => c.type === type || c.type === 'BOTH',
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId || !amount) return;
    onSubmit({
      amount: Number(amount),
      currency,
      type,
      categoryId: Number(categoryId),
      note: note || undefined,
      date: date ? new Date(date).toISOString() : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setType('EXPENSE')}
          className={`rounded-md border px-3 py-2 text-sm transition-colors ${
            type === 'EXPENSE'
              ? 'border-expense bg-expense-bg text-expense'
              : 'border-border'
          }`}
        >
          {t('transactions.expense')}
        </button>
        <button
          type="button"
          onClick={() => setType('INCOME')}
          className={`rounded-md border px-3 py-2 text-sm transition-colors ${
            type === 'INCOME' ? 'border-income bg-income-bg text-income' : 'border-border'
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
            {filtered.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {lang === 'uz' ? c.nameUz : lang === 'ru' ? c.nameRu : c.nameEn}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label className="text-xs">{t('transactions.date')}</Label>
        <Input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <Label className="text-xs">{t('transactions.note')}</Label>
        <Input value={note} onChange={(e) => setNote(e.target.value)} />
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {t('common.save')}
      </Button>
    </form>
  );
}
