'use client';

import { transactionColumns } from './columns';
import { TransactionForm } from './form';
import { CustomDataTable } from '@/components/custom-data-table';
import { Transaction } from '@/types/primitives/Transaction';
import { Dialog } from '@repo/ui/components/ui/dialog';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';

interface Props {
  wsId: string;
  data: Transaction[];
  count: number;
}

export default function TransactionsTable({ wsId, data, count }: Props) {
  const locale = useLocale();
  const t = useTranslations('common');

  const [transaction, setTransaction] = useState<Transaction>();

  const onComplete = () => {
    setTransaction(undefined);
  };

  return (
    <Dialog
      open={!!transaction}
      onOpenChange={(open) =>
        setTransaction(open ? transaction || {} : undefined)
      }
    >
      <CustomDataTable
        data={data}
        columnGenerator={(t: any) =>
          transactionColumns(t, setTransaction, locale)
        }
        namespace="transaction-data-table"
        count={count}
        defaultVisibility={{
          id: false,
          report_opt_in: false,
          created_at: false,
        }}
        editContent={
          <TransactionForm
            wsId={wsId}
            data={transaction}
            onComplete={onComplete}
            submitLabel={transaction?.id ? t('edit') : t('create')}
          />
        }
      />
    </Dialog>
  );
}
