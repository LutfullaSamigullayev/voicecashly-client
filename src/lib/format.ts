import { format, formatDistanceToNow, type Locale } from 'date-fns';
import { uz, ru, enUS } from 'date-fns/locale';
import type { Currency, Lang } from '@/types';

const localeMap: Record<Lang, Locale> = { uz, ru, en: enUS };

export function formatMoney(amount: number | string, currency: Currency = 'UZS', lang: Lang = 'uz'): string {
  const n = typeof amount === 'string' ? Number(amount) : amount;
  if (Number.isNaN(n)) return '—';
  if (currency === 'USD') {
    return new Intl.NumberFormat(lang === 'uz' ? 'en-US' : lang, {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(n);
  }
  const formatted = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(n));
  return `${formatted} so'm`;
}

export function formatDate(date: Date | string | null | undefined, pattern = 'd MMM, HH:mm', lang: Lang = 'uz'): string {
  if (!date) return '—';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return '—';
  return format(d, pattern, { locale: localeMap[lang] });
}

export function formatRelative(date: Date | string | null | undefined, lang: Lang = 'uz'): string {
  if (!date) return '—';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return '—';
  return formatDistanceToNow(d, { addSuffix: true, locale: localeMap[lang] });
}

export function formatPercent(n: number): string {
  const sign = n > 0 ? '+' : '';
  return `${sign}${n.toFixed(1)}%`;
}

export function getMonthName(month: number, lang: Lang = 'uz'): string {
  if (!Number.isInteger(month) || month < 1 || month > 12) return '—';
  return format(new Date(2000, month - 1, 1), 'MMMM', { locale: localeMap[lang] });
}
