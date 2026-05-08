import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CategoryCard } from '@/components/categories/CategoryCard';
import { CategoryForm, type CategoryFormValue } from '@/components/categories/CategoryForm';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { EmptyState } from '@/components/shared/EmptyState';
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from '@/hooks/useCategories';
import { useActiveWorkspace } from '@/hooks/useWorkspaces';
import { useBudgetProgress, useUpsertBudget } from '@/hooks/useBudgets';
import type { Category, CategoryType, Currency } from '@/types';

export default function CategoriesPage() {
  const { t } = useTranslation();
  const active = useActiveWorkspace();
  const wsId = active?.workspaceId ?? null;
  const { data: categories, isLoading } = useCategories(wsId);
  const { data: budgetProgress } = useBudgetProgress(wsId);
  const create = useCreateCategory();
  const update = useUpdateCategory();
  const remove = useDeleteCategory();
  const upsertBudget = useUpsertBudget();

  const [tab, setTab] = useState<'ALL' | CategoryType>('ALL');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState<Category | null>(null);
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [budgetCat, setBudgetCat] = useState<Category | null>(null);
  const [budgetAmount, setBudgetAmount] = useState('');
  const [budgetCurrency, setBudgetCurrency] = useState<Currency>('UZS');

  const filtered = useMemo(() => {
    const items = categories ?? [];
    if (tab === 'ALL') return items;
    return items.filter((c) => c.type === tab || c.type === 'BOTH');
  }, [categories, tab]);

  const progressMap = useMemo(() => {
    const map = new Map<number, { budget: number; spent: number }>();
    (budgetProgress ?? []).forEach((p) => {
      map.set(p.categoryId, { budget: p.budget, spent: p.spent });
    });
    return map;
  }, [budgetProgress]);

  const handleSubmit = (v: CategoryFormValue) => {
    if (!wsId) return;
    if (editing) {
      update.mutate(
        { id: editing.id, input: v },
        { onSuccess: () => setFormOpen(false) },
      );
    } else {
      create.mutate({ workspaceId: wsId, ...v }, { onSuccess: () => setFormOpen(false) });
    }
  };

  const handleSaveBudget = () => {
    if (!wsId || !budgetCat || !budgetAmount) return;
    const now = new Date();
    upsertBudget.mutate(
      {
        workspaceId: wsId,
        categoryId: budgetCat.id,
        amount: Number(budgetAmount),
        currency: budgetCurrency,
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      },
      {
        onSuccess: () => {
          setBudgetOpen(false);
          setBudgetAmount('');
        },
      },
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium">{t('categories.title')}</h1>
        <Button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          {t('categories.add_new')}
        </Button>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as CategoryType | 'ALL')}>
        <TabsList>
          <TabsTrigger value="ALL">{t('common.all')}</TabsTrigger>
          <TabsTrigger value="INCOME">{t('categories.type_income')}</TabsTrigger>
          <TabsTrigger value="EXPENSE">{t('categories.type_expense')}</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title={t('empty.no_categories')} />
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => {
            const p = progressMap.get(c.id);
            return (
              <CategoryCard
                key={c.id}
                category={c}
                budget={p?.budget}
                spent={p?.spent}
                monthlyTotal={p?.spent ?? 0}
                onEdit={(cc) => {
                  setEditing(cc);
                  setFormOpen(true);
                }}
                onDelete={(cc) => {
                  setDeleting(cc);
                  setDeleteOpen(true);
                }}
                onSetBudget={(cc) => {
                  setBudgetCat(cc);
                  setBudgetAmount(p?.budget ? String(p.budget) : '');
                  setBudgetOpen(true);
                }}
              />
            );
          })}
        </div>
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? t('categories.edit_title') : t('categories.create_title')}
            </DialogTitle>
          </DialogHeader>
          <CategoryForm
            initial={editing ?? undefined}
            onSubmit={handleSubmit}
            isPending={create.isPending || update.isPending}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={budgetOpen} onOpenChange={setBudgetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('categories.set_budget')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2 space-y-1">
                <Label className="text-xs">{t('transactions.amount')}</Label>
                <Input
                  type="number"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{t('transactions.filter_currency')}</Label>
                <Select
                  value={budgetCurrency}
                  onValueChange={(v) => setBudgetCurrency(v as Currency)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UZS">UZS</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              onClick={handleSaveBudget}
              disabled={upsertBudget.isPending}
              className="w-full"
            >
              {t('common.save')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={t('common.delete') + '?'}
        destructive
        onConfirm={() => {
          if (deleting) remove.mutate(deleting.id);
        }}
        confirmLabel={t('common.delete')}
      />
    </div>
  );
}
