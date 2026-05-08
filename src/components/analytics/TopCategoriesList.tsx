import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CurrencyAmount } from '@/components/shared/CurrencyAmount';
import type { CategoryBreakdownItem, Lang } from '@/types';

interface Props {
  title: string;
  data: CategoryBreakdownItem[];
}

export function TopCategoriesList({ title, data }: Props) {
  const { i18n } = useTranslation();
  const lang = (i18n.language?.slice(0, 2) ?? 'uz') as Lang;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {data.slice(0, 7).map((d) => {
            const name =
              lang === 'uz'
                ? d.category.nameUz
                : lang === 'ru'
                  ? d.category.nameRu
                  : d.category.nameEn;
            return (
              <li key={d.categoryId} className="flex items-center gap-3">
                <span
                  className="h-7 w-7 flex-shrink-0 rounded-md"
                  style={{ background: d.category.color }}
                />
                <div className="flex-1 truncate">
                  <div className="truncate text-sm">{name}</div>
                  <div className="text-xs text-muted-foreground">{d.count}</div>
                </div>
                <CurrencyAmount amount={d.total} className="text-sm" />
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
