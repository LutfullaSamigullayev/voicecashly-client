import { useTranslation } from 'react-i18next';
import { Pencil, Trash2 } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CurrencyAmount } from '@/components/shared/CurrencyAmount';
import { formatDate } from '@/lib/format';
import type { Transaction, Lang } from '@/types';

interface Props {
  tx: Transaction;
  onEdit: (tx: Transaction) => void;
  onDelete: (tx: Transaction) => void;
}

export function TransactionRow({ tx, onEdit, onDelete }: Props) {
  const { i18n } = useTranslation();
  const lang = (i18n.language?.slice(0, 2) ?? 'uz') as Lang;
  const note =
    lang === 'uz' ? tx.noteUz : lang === 'ru' ? tx.noteRu : tx.noteEn;
  const catName = tx.category
    ? lang === 'uz'
      ? tx.category.nameUz
      : lang === 'ru'
        ? tx.category.nameRu
        : tx.category.nameEn
    : '';

  return (
    <TableRow className="group">
      <TableCell className="text-xs text-muted-foreground">
        {formatDate(tx.date, 'd MMM, HH:mm', lang)}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: tx.category?.color ?? '#888' }}
          />
          <span className="text-sm">{note || catName}</span>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline">{catName}</Badge>
      </TableCell>
      <TableCell>
        <Badge variant={tx.type === 'INCOME' ? 'income' : 'expense'}>
          {tx.type === 'INCOME' ? '+' : '−'}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <CurrencyAmount
          amount={tx.amount}
          currency={tx.currency}
          sign={tx.type === 'INCOME' ? '+' : '−'}
          className={tx.type === 'INCOME' ? 'text-income' : 'text-expense'}
        />
      </TableCell>
      <TableCell className="text-xs text-muted-foreground">
        {tx.user?.firstName ?? ''}
      </TableCell>
      <TableCell>
        <div className="flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button variant="ghost" size="icon" onClick={() => onEdit(tx)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(tx)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
