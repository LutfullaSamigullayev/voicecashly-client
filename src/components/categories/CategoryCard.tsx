import { useTranslation } from 'react-i18next';
import { Pencil, Trash2, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BudgetProgressBar } from './BudgetProgressBar';
import { CurrencyAmount } from '@/components/shared/CurrencyAmount';
import type { Category, Lang } from '@/types';

interface Props {
  category: Category;
  monthlyTotal?: number;
  txCount?: number;
  budget?: number;
  spent?: number;
  onEdit: (c: Category) => void;
  onDelete: (c: Category) => void;
  onSetBudget: (c: Category) => void;
}

export function CategoryCard({
  category,
  monthlyTotal = 0,
  txCount = 0,
  budget,
  spent = 0,
  onEdit,
  onDelete,
  onSetBudget,
}: Props) {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language?.slice(0, 2) ?? 'uz') as Lang;
  const name =
    lang === 'uz' ? category.nameUz : lang === 'ru' ? category.nameRu : category.nameEn;

  return (
    <Card className="group transition-shadow hover:shadow-sm">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium text-white"
              style={{ background: category.color }}
            >
              {name.slice(0, 1).toUpperCase()}
            </span>
            <div>
              <div className="text-sm font-medium">{name}</div>
              <div className="text-xs text-muted-foreground">
                {t('categories.transactions_count', { count: txCount })}
              </div>
            </div>
          </div>
          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button variant="ghost" size="icon" onClick={() => onSetBudget(category)}>
              <Target className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onEdit(category)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive"
              onClick={() => onDelete(category)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <div className="text-sm tabular">
          <CurrencyAmount amount={monthlyTotal} />
        </div>

        {budget !== undefined && budget > 0 ? (
          <BudgetProgressBar spent={spent} budget={budget} />
        ) : (
          <div className="text-xs text-muted-foreground">{t('categories.no_budget')}</div>
        )}
      </CardContent>
    </Card>
  );
}
