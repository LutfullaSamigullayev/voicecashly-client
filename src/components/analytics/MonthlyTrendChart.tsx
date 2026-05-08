import { useTranslation } from 'react-i18next';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getMonthName } from '@/lib/format';
import type { Lang, MonthlyPoint } from '@/types';

export function MonthlyTrendChart({ data }: { data: MonthlyPoint[] }) {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language?.slice(0, 2) ?? 'uz') as Lang;

  const chartData = data.map((d) => ({
    name: getMonthName(d.month, lang).slice(0, 3),
    income: d.income,
    expense: d.expense,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('overview.monthly_chart')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) =>
                  v >= 1_000_000
                    ? `${(v / 1_000_000).toFixed(1)}M`
                    : v >= 1000
                      ? `${Math.round(v / 1000)}k`
                      : String(v)
                }
              />
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar
                dataKey="income"
                name={t('transactions.income')}
                fill="hsl(var(--income))"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="expense"
                name={t('transactions.expense')}
                fill="hsl(var(--expense))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
