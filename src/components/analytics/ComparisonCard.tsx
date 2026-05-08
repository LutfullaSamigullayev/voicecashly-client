import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Props {
  label: string;
  value: string;
  hint?: string;
  tone?: 'income' | 'expense' | 'default';
}

export function ComparisonCard({ label, value, hint, tone = 'default' }: Props) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-xs uppercase text-muted-foreground">{label}</div>
        <div
          className={cn(
            'tabular mt-2 text-xl font-medium',
            tone === 'income' && 'text-income',
            tone === 'expense' && 'text-expense',
          )}
        >
          {value}
        </div>
        {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
      </CardContent>
    </Card>
  );
}
