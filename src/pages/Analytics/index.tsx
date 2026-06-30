import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ComparisonCard } from '@/components/analytics/ComparisonCard';
import { TopCategoriesList } from '@/components/analytics/TopCategoriesList';
import { EmptyState } from '@/components/shared/EmptyState';
import { CurrencyAmount } from '@/components/shared/CurrencyAmount';
import { useActiveWorkspace } from '@/hooks/useWorkspaces';
import { useByCategoryAnalytics, useMonthlyAnalytics } from '@/hooks/useAnalytics';
import { useSummary } from '@/hooks/useTransactions';
import { getMonthName, formatMoney } from '@/lib/format';
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

export default function AnalyticsPage() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language?.slice(0, 2) ?? 'uz') as Lang;
  const [period, setPeriod] = useState<Period>('month');
  const active = useActiveWorkspace();
  const wsId = active?.workspaceId ?? null;
  const range = useMemo(() => periodRange(period), [period]);

  const { data: monthly } = useMonthlyAnalytics(wsId, 6);
  const { data: byCategoryExpense } = useByCategoryAnalytics(wsId, 'EXPENSE', range.from, range.to);
  const { data: byCategoryIncome } = useByCategoryAnalytics(wsId, 'INCOME', range.from, range.to);
  const { data: summary } = useSummary(wsId, range.from, range.to);

  const days =
    period === 'week' ? 7 : period === 'month' ? 30 : 365;
  const avgDailyIncome = (summary?.income ?? 0) / days;
  const profitMargin =
    summary && summary.income > 0
      ? ((summary.net / summary.income) * 100).toFixed(1) + '%'
      : '—';
  const topExpense = (byCategoryExpense ?? []).slice().sort((a, b) => b.amount - a.amount)[0];
  const topExpenseName = topExpense
    ? lang === 'uz'
      ? topExpense.nameUz
      : lang === 'ru'
        ? topExpense.nameRu
        : topExpense.nameEn
    : '—';

  const trendData = (monthly ?? []).map((d) => ({
    name: getMonthName(d.month, lang).slice(0, 3),
    income: d.income,
    expense: d.expense,
  }));

  if (monthly && monthly.length === 0) {
    return <EmptyState title={t('empty.no_analytics')} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium">{t('analytics.title')}</h1>
        <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
          <TabsList>
            <TabsTrigger value="week">{t('overview.period_week')}</TabsTrigger>
            <TabsTrigger value="month">{t('overview.period_month')}</TabsTrigger>
            <TabsTrigger value="year">{t('overview.period_year')}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <ComparisonCard
          label={t('analytics.avg_daily_income')}
          value={formatMoney(avgDailyIncome, 'UZS', lang)}
          tone="income"
        />
        <ComparisonCard
          label={t('analytics.top_expense_category')}
          value={topExpenseName}
          hint={topExpense ? formatMoney(topExpense.amount, 'UZS', lang) : undefined}
          tone="expense"
        />
        <ComparisonCard label={t('analytics.profit_margin')} value={profitMargin} />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('analytics.trend_6m')}</CardTitle>
          </CardHeader>
          <CardContent>
            {monthly ? (
              <div className="h-72">
                <ResponsiveContainer>
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="incFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--income))" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="hsl(var(--income))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="expFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--expense))" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="hsl(var(--expense))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Area
                      type="monotone"
                      dataKey="income"
                      name={t('transactions.income')}
                      stroke="hsl(var(--income))"
                      fill="url(#incFill)"
                    />
                    <Area
                      type="monotone"
                      dataKey="expense"
                      name={t('transactions.expense')}
                      stroke="hsl(var(--expense))"
                      fill="url(#expFill)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <Skeleton className="h-72" />
            )}
          </CardContent>
        </Card>

        <TopCategoriesList
          title={t('analytics.expense_by_category')}
          data={byCategoryExpense ?? []}
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('analytics.income_sources')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl tabular font-medium text-income">
              <CurrencyAmount amount={summary?.income ?? 0} />
            </div>
            <ul className="mt-3 space-y-2">
              {(byCategoryIncome ?? []).slice(0, 5).map((d) => (
                <li key={d.categoryId} className="flex justify-between text-xs">
                  <span>
                    {lang === 'uz'
                      ? d.nameUz
                      : lang === 'ru'
                        ? d.nameRu
                        : d.nameEn}
                  </span>
                  <span className="tabular text-muted-foreground">
                    {Math.round(d.amount).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('analytics.expense_types')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl tabular font-medium text-expense">
              <CurrencyAmount amount={summary?.expense ?? 0} />
            </div>
            <ul className="mt-3 space-y-2">
              {(byCategoryExpense ?? []).slice(0, 5).map((d) => (
                <li key={d.categoryId} className="flex justify-between text-xs">
                  <span>
                    {lang === 'uz'
                      ? d.nameUz
                      : lang === 'ru'
                        ? d.nameRu
                        : d.nameEn}
                  </span>
                  <span className="tabular text-muted-foreground">
                    {Math.round(d.amount).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
