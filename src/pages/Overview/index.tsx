import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Receipt,
  TrendingUp,
  Mic,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { MetricCard } from '@/components/shared/MetricCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { CurrencyAmount } from '@/components/shared/CurrencyAmount';
import { MonthlyTrendChart } from '@/components/analytics/MonthlyTrendChart';
import { CategoryBreakdownChart } from '@/components/analytics/CategoryBreakdownChart';
import { QuickAddForm } from '@/components/transactions/QuickAddForm';
import { useActiveWorkspace } from '@/hooks/useWorkspaces';
import { useSummary, useTransactions } from '@/hooks/useTransactions';
import { useByCategoryAnalytics, useMonthlyAnalytics } from '@/hooks/useAnalytics';
import { formatDate } from '@/lib/format';
import type { Lang } from '@/types';

type Period = 'week' | 'month' | 'year';

function periodRange(period: Period): { from: string; to: string } {
  const to = new Date();
  const from = new Date();
  if (period === 'week') from.setDate(from.getDate() - 7);
  else if (period === 'month') from.setMonth(from.getMonth() - 1);
  else from.setFullYear(from.getFullYear() - 1);
  return { from: from.toISOString(), to: to.toISOString() };
}

const BOT_USERNAME = import.meta.env.VITE_BOT_USERNAME ?? 'VoiceCashlyBot';

export default function OverviewPage() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language?.slice(0, 2) ?? 'uz') as Lang;
  const [period, setPeriod] = useState<Period>('month');
  const active = useActiveWorkspace();
  const wsId = active?.workspaceId ?? null;
  const { from, to } = useMemo(() => periodRange(period), [period]);

  const { data: summary, isLoading: sumLoading } = useSummary(wsId, from, to);
  const { data: txList, isLoading: txLoading } = useTransactions(
    wsId ? { workspaceId: wsId, limit: 5, page: 1 } : null,
  );
  const { data: monthly } = useMonthlyAnalytics(wsId, 8);
  const { data: byCategory } = useByCategoryAnalytics(wsId, 'EXPENSE', from, to);

  if (!sumLoading && txList && txList.total === 0) {
    return (
      <EmptyState
        icon={<Mic className="h-10 w-10" />}
        title={t('empty.no_transactions')}
        description={t('empty.no_transactions_desc')}
        action={
          <>
            <Button asChild>
              <a href={`https://t.me/${BOT_USERNAME}`} target="_blank" rel="noreferrer">
                {t('empty.open_bot')}
              </a>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/transactions">{t('empty.add_tx')}</Link>
            </Button>
          </>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium">{t('nav.overview')}</h1>
        <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
          <TabsList>
            <TabsTrigger value="week">{t('overview.period_week')}</TabsTrigger>
            <TabsTrigger value="month">{t('overview.period_month')}</TabsTrigger>
            <TabsTrigger value="year">{t('overview.period_year')}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {sumLoading ? (
          <>
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </>
        ) : (
          <>
            <MetricCard
              label={t('overview.total_income')}
              value={<CurrencyAmount amount={summary?.income ?? 0} />}
              icon={<ArrowUpCircle className="h-4 w-4" />}
              tone="income"
            />
            <MetricCard
              label={t('overview.total_expense')}
              value={<CurrencyAmount amount={summary?.expense ?? 0} />}
              icon={<ArrowDownCircle className="h-4 w-4" />}
              tone="expense"
            />
            <MetricCard
              label={t('overview.net_profit')}
              value={<CurrencyAmount amount={summary?.net ?? 0} />}
              icon={<TrendingUp className="h-4 w-4" />}
              tone={(summary?.net ?? 0) >= 0 ? 'income' : 'expense'}
            />
            <MetricCard
              label={t('overview.transactions_count')}
              value={String(txList?.total ?? 0)}
              icon={<Receipt className="h-4 w-4" />}
            />
          </>
        )}
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {monthly && monthly.length > 0 ? (
            <MonthlyTrendChart data={monthly} />
          ) : (
            <Skeleton className="h-72" />
          )}
        </div>
        {byCategory && byCategory.length > 0 ? (
          <CategoryBreakdownChart data={byCategory} />
        ) : (
          <Skeleton className="h-72" />
        )}
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>{t('overview.recent')}</CardTitle>
            <Link to="/transactions" className="text-xs text-primary hover:underline">
              {t('overview.see_all')}
            </Link>
          </CardHeader>
          <CardContent>
            {txLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {(txList?.items ?? []).map((tx) => {
                  const name = tx.category
                    ? lang === 'uz'
                      ? tx.category.nameUz
                      : lang === 'ru'
                        ? tx.category.nameRu
                        : tx.category.nameEn
                    : '';
                  return (
                    <li key={tx.id} className="flex items-center justify-between py-2.5">
                      <div className="flex items-center gap-3">
                        <span
                          className="h-8 w-8 rounded-md"
                          style={{ background: tx.category?.color ?? '#888' }}
                        />
                        <div>
                          <div className="text-sm">{name}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(tx.date, 'd MMM, HH:mm', lang)}
                          </div>
                        </div>
                      </div>
                      <CurrencyAmount
                        amount={tx.amount}
                        currency={tx.currency}
                        sign={tx.type === 'INCOME' ? '+' : '−'}
                        className={
                          tx.type === 'INCOME'
                            ? 'text-income text-sm'
                            : 'text-expense text-sm'
                        }
                      />
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
        <QuickAddForm />
      </div>
    </div>
  );
}
