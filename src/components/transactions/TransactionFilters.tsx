import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DateRangePicker } from '@/components/shared/DateRangePicker';
import type { Category, Currency, Lang, TxType } from '@/types';

interface Props {
  search: string;
  onSearch: (s: string) => void;
  type: TxType | 'ALL';
  onType: (t: TxType | 'ALL') => void;
  categoryId: string;
  onCategory: (id: string) => void;
  currency: Currency | 'ALL';
  onCurrency: (c: Currency | 'ALL') => void;
  from: string;
  to: string;
  onDateChange: (from: string, to: string) => void;
  categories: Category[];
}

export function TransactionFilters({
  search,
  onSearch,
  type,
  onType,
  categoryId,
  onCategory,
  currency,
  onCurrency,
  from,
  to,
  onDateChange,
  categories,
}: Props) {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language?.slice(0, 2) ?? 'uz') as Lang;

  return (
    <div className="flex flex-wrap items-end gap-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={t('transactions.search')}
          className="w-56 pl-8"
        />
      </div>
      <DateRangePicker from={from} to={to} onChange={onDateChange} />
      <Select value={type} onValueChange={(v) => onType(v as TxType | 'ALL')}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder={t('transactions.filter_type')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">{t('common.all')}</SelectItem>
          <SelectItem value="INCOME">{t('transactions.income')}</SelectItem>
          <SelectItem value="EXPENSE">{t('transactions.expense')}</SelectItem>
        </SelectContent>
      </Select>
      <Select value={categoryId} onValueChange={onCategory}>
        <SelectTrigger className="w-44">
          <SelectValue placeholder={t('transactions.filter_category')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">{t('common.all')}</SelectItem>
          {categories.map((c) => (
            <SelectItem key={c.id} value={String(c.id)}>
              {lang === 'uz' ? c.nameUz : lang === 'ru' ? c.nameRu : c.nameEn}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={currency} onValueChange={(v) => onCurrency(v as Currency | 'ALL')}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder={t('transactions.filter_currency')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">{t('common.all')}</SelectItem>
          <SelectItem value="UZS">UZS</SelectItem>
          <SelectItem value="USD">USD</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
