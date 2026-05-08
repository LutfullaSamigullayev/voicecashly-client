import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TransactionsTable } from '@/components/transactions/TransactionsTable';
import { TransactionFilters } from '@/components/transactions/TransactionFilters';
import { EditTransactionModal } from '@/components/transactions/EditTransactionModal';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { EmptyState } from '@/components/shared/EmptyState';
import { useActiveWorkspace } from '@/hooks/useWorkspaces';
import { useCategories } from '@/hooks/useCategories';
import { useDeleteTransaction, useTransactions } from '@/hooks/useTransactions';
import { transactionsService } from '@/services/transactions.service';
import type { Currency, Lang, Transaction, TxType } from '@/types';

export default function TransactionsPage() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language?.slice(0, 2) ?? 'uz') as Lang;
  const active = useActiveWorkspace();
  const wsId = active?.workspaceId ?? null;
  const { data: categories } = useCategories(wsId);

  const [search, setSearch] = useState('');
  const [type, setType] = useState<TxType | 'ALL'>('ALL');
  const [categoryId, setCategoryId] = useState<string>('ALL');
  const [currency, setCurrency] = useState<Currency | 'ALL'>('ALL');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(1);

  const [editOpen, setEditOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingTx, setDeletingTx] = useState<Transaction | null>(null);
  const remove = useDeleteTransaction();

  const filters = useMemo(() => {
    if (!wsId) return null;
    return {
      workspaceId: wsId,
      type: type === 'ALL' ? undefined : type,
      categoryId: categoryId === 'ALL' ? undefined : Number(categoryId),
      from: from ? new Date(from).toISOString() : undefined,
      to: to ? new Date(to).toISOString() : undefined,
      page,
      limit: 20,
    };
  }, [wsId, type, categoryId, from, to, page]);

  const { data: txList, isLoading } = useTransactions(filters);

  const filteredItems = useMemo(() => {
    let items = txList?.items ?? [];
    if (search) {
      const q = search.toLowerCase();
      items = items.filter((tx) => {
        const note =
          (lang === 'uz' ? tx.noteUz : lang === 'ru' ? tx.noteRu : tx.noteEn) ?? '';
        const cat = tx.category
          ? lang === 'uz'
            ? tx.category.nameUz
            : lang === 'ru'
              ? tx.category.nameRu
              : tx.category.nameEn
          : '';
        return note.toLowerCase().includes(q) || cat.toLowerCase().includes(q);
      });
    }
    if (currency !== 'ALL') items = items.filter((tx) => tx.currency === currency);
    return items;
  }, [txList, search, currency, lang]);

  const handleExport = async () => {
    if (!wsId) return;
    const blob = await transactionsService.exportCsv(
      wsId,
      from ? new Date(from).toISOString() : undefined,
      to ? new Date(to).toISOString() : undefined,
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const total = txList?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / 20));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-medium">{t('nav.transactions')}</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4" />
            {t('transactions.export')}
          </Button>
          <Button
            onClick={() => {
              setEditingTx(null);
              setEditOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            {t('transactions.add_new')}
          </Button>
        </div>
      </div>

      <TransactionFilters
        search={search}
        onSearch={setSearch}
        type={type}
        onType={setType}
        categoryId={categoryId}
        onCategory={setCategoryId}
        currency={currency}
        onCurrency={setCurrency}
        from={from}
        to={to}
        onDateChange={(f, tt) => {
          setFrom(f);
          setTo(tt);
        }}
        categories={categories ?? []}
      />

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      ) : filteredItems.length === 0 ? (
        <EmptyState
          title={t('empty.no_transactions')}
          description={t('empty.no_transactions_desc')}
        />
      ) : (
        <>
          <TransactionsTable
            items={filteredItems}
            onEdit={(tx) => {
              setEditingTx(tx);
              setEditOpen(true);
            }}
            onDelete={(tx) => {
              setDeletingTx(tx);
              setDeleteOpen(true);
            }}
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{t('transactions.total_count', { count: total })}</span>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                {t('common.back')}
              </Button>
              <span className="flex items-center px-2">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                {t('common.next')}
              </Button>
            </div>
          </div>
        </>
      )}

      {wsId && (
        <EditTransactionModal
          open={editOpen}
          onOpenChange={setEditOpen}
          workspaceId={wsId}
          transaction={editingTx}
        />
      )}

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={t('transactions.delete_confirm')}
        destructive
        onConfirm={() => {
          if (deletingTx) remove.mutate(deletingTx.id);
        }}
        confirmLabel={t('common.delete')}
      />
    </div>
  );
}
