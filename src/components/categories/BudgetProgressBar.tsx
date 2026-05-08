import { cn } from '@/lib/utils';

interface Props {
  spent: number;
  budget: number;
}

export function BudgetProgressBar({ spent, budget }: Props) {
  if (!budget) return null;
  const percent = Math.min(200, Math.round((spent / budget) * 100));
  const tone =
    percent >= 100 ? 'bg-danger' : percent >= 80 ? 'bg-warning' : 'bg-income';
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{percent}%</span>
        <span className="tabular text-muted-foreground">
          {spent.toLocaleString()} / {budget.toLocaleString()}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted/15">
        <div
          className={cn('h-full transition-all', tone)}
          style={{ width: `${Math.min(100, percent)}%` }}
        />
      </div>
    </div>
  );
}
