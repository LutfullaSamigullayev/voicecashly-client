import { useTranslation } from 'react-i18next';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CategoryBreakdownItem, Lang } from '@/types';

export function CategoryBreakdownChart({ data }: { data: CategoryBreakdownItem[] }) {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language?.slice(0, 2) ?? 'uz') as Lang;
  const top5 = [...data].sort((a, b) => b.amount - a.amount).slice(0, 5);

  const chartData = top5.map((d) => ({
    name: lang === 'uz' ? d.nameUz : lang === 'ru' ? d.nameRu : d.nameEn,
    value: d.amount,
    color: d.color,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('overview.by_category')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex h-72 items-center">
          <div className="w-1/2 h-full">
            <ResponsiveContainer>
              <PieChart>
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={48}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {chartData.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-2 pl-4">
            {chartData.map((d) => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: d.color }} />
                <span className="flex-1 truncate">{d.name}</span>
                <span className="tabular text-muted-foreground">
                  {Math.round(d.value).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
