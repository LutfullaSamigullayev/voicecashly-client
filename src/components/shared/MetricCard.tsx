import type { ReactNode } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatPercent } from '@/lib/format';

interface MetricCardProps {
  label: string;
  value: ReactNode;
  delta?: number;
  icon?: ReactNode;
  tone?: 'income' | 'expense' | 'default';
}

export function MetricCard({ label, value, delta, icon, tone = 'default' }: MetricCardProps) {
  const positive = delta !== undefined && delta >= 0;
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
        <div
          className={cn(
            'tabular mt-2 text-2xl font-medium',
            tone === 'income' && 'text-income',
            tone === 'expense' && 'text-expense',
          )}
        >
          {value}
        </div>
        {delta !== undefined && (
          <div className="mt-2 flex items-center gap-1 text-xs">
            {positive ? (
              <ArrowUp className="h-3 w-3 text-income" />
            ) : (
              <ArrowDown className="h-3 w-3 text-expense" />
            )}
            <span className={cn(positive ? 'text-income' : 'text-expense')}>
              {formatPercent(delta)}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
