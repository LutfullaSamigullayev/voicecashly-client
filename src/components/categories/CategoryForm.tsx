import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Category, CategoryType } from '@/types';

const PRESET_COLORS = [
  '#0F6E56',
  '#1D9E75',
  '#D85A30',
  '#FAC775',
  '#A32D2D',
  '#3B82F6',
  '#8B5CF6',
  '#EC4899',
  '#6B7280',
];

export interface CategoryFormValue {
  nameUz: string;
  nameRu: string;
  nameEn: string;
  type: CategoryType;
  color: string;
  icon: string;
}

interface Props {
  initial?: Category;
  onSubmit: (v: CategoryFormValue) => void;
  isPending?: boolean;
}

export function CategoryForm({ initial, onSubmit, isPending }: Props) {
  const { t } = useTranslation();
  const [nameUz, setNameUz] = useState(initial?.nameUz ?? '');
  const [nameRu, setNameRu] = useState(initial?.nameRu ?? '');
  const [nameEn, setNameEn] = useState(initial?.nameEn ?? '');
  const [type, setType] = useState<CategoryType>(initial?.type ?? 'EXPENSE');
  const [color, setColor] = useState(initial?.color ?? PRESET_COLORS[0]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameUz || !nameRu || !nameEn) return;
    onSubmit({ nameUz, nameRu, nameEn, type, color, icon: 'tag' });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-1">
        <Label className="text-xs">{t('categories.name')}</Label>
        <Tabs defaultValue="uz">
          <TabsList className="h-8">
            <TabsTrigger value="uz">UZ</TabsTrigger>
            <TabsTrigger value="ru">RU</TabsTrigger>
            <TabsTrigger value="en">EN</TabsTrigger>
          </TabsList>
          <TabsContent value="uz">
            <Input value={nameUz} onChange={(e) => setNameUz(e.target.value)} />
          </TabsContent>
          <TabsContent value="ru">
            <Input value={nameRu} onChange={(e) => setNameRu(e.target.value)} />
          </TabsContent>
          <TabsContent value="en">
            <Input value={nameEn} onChange={(e) => setNameEn(e.target.value)} />
          </TabsContent>
        </Tabs>
      </div>

      <div className="space-y-1">
        <Label className="text-xs">{t('categories.type')}</Label>
        <Select value={type} onValueChange={(v) => setType(v as CategoryType)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EXPENSE">{t('categories.type_expense')}</SelectItem>
            <SelectItem value="INCOME">{t('categories.type_income')}</SelectItem>
            <SelectItem value="BOTH">{t('categories.type_both')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label className="text-xs">{t('categories.color')}</Label>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`h-7 w-7 rounded-md ring-offset-2 transition-shadow ${
                color === c ? 'ring-2 ring-foreground' : ''
              }`}
              style={{ background: c }}
            />
          ))}
        </div>
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {t('common.save')}
      </Button>
    </form>
  );
}
