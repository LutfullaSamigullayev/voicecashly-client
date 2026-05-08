import { useTranslation } from 'react-i18next';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TransactionRow } from './TransactionRow';
import type { Transaction } from '@/types';

interface Props {
  items: Transaction[];
  onEdit: (tx: Transaction) => void;
  onDelete: (tx: Transaction) => void;
}

export function TransactionsTable({ items, onEdit, onDelete }: Props) {
  const { t } = useTranslation();
  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('transactions.date')}</TableHead>
            <TableHead>{t('transactions.note')}</TableHead>
            <TableHead>{t('transactions.category')}</TableHead>
            <TableHead>{t('transactions.filter_type')}</TableHead>
            <TableHead className="text-right">{t('transactions.amount')}</TableHead>
            <TableHead>{t('transactions.added_by')}</TableHead>
            <TableHead className="text-right">{t('transactions.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((tx) => (
            <TransactionRow key={tx.id} tx={tx} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
