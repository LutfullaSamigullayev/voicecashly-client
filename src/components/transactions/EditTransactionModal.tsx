import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TransactionForm, type TransactionFormValue } from './TransactionForm';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { useDeleteTransaction, useUpdateTransaction } from '@/hooks/useTransactions';
import { useCreateTransaction } from '@/hooks/useTransactions';
import type { Transaction } from '@/types';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: number;
  transaction: Transaction | null;
}

export function EditTransactionModal({
  open,
  onOpenChange,
  workspaceId,
  transaction,
}: Props) {
  const { t } = useTranslation();
  const update = useUpdateTransaction();
  const create = useCreateTransaction();
  const remove = useDeleteTransaction();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSubmit = (v: TransactionFormValue) => {
    const payload = { ...v, workspaceId };
    if (transaction) {
      update.mutate({ id: transaction.id, input: payload }, { onSuccess: () => onOpenChange(false) });
    } else {
      create.mutate(payload, { onSuccess: () => onOpenChange(false) });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {transaction ? t('transactions.edit_title') : t('transactions.add_new')}
            </DialogTitle>
          </DialogHeader>
          <TransactionForm
            workspaceId={workspaceId}
            initial={transaction ?? undefined}
            onSubmit={handleSubmit}
            isPending={update.isPending || create.isPending}
          />
          {transaction && (
            <Button
              variant="destructive"
              onClick={() => setConfirmDelete(true)}
              className="w-full"
            >
              {t('common.delete')}
            </Button>
          )}
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title={t('transactions.delete_confirm')}
        destructive
        onConfirm={() => {
          if (!transaction) return;
          remove.mutate(transaction.id, {
            onSuccess: () => {
              onOpenChange(false);
            },
          });
        }}
        confirmLabel={t('common.delete')}
      />
    </>
  );
}
