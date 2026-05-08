import { useTranslation } from 'react-i18next';
import { formatMoney } from '@/lib/format';
import type { Currency, Lang } from '@/types';
import { cn } from '@/lib/utils';

interface CurrencyAmountProps {
  amount: number | string;
  currency?: Currency;
  className?: string;
  sign?: '+' | '-' | '−';
}

export function CurrencyAmount({ amount, currency = 'UZS', className, sign }: CurrencyAmountProps) {
  const { i18n } = useTranslation();
  const lang = (i18n.language?.slice(0, 2) ?? 'uz') as Lang;
  return (
    <span className={cn('tabular', className)}>
      {sign}
      {formatMoney(amount, currency, lang)}
    </span>
  );
}
