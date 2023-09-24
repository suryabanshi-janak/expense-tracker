import { format } from 'date-fns';
import { type ColumnDef } from '@tanstack/react-table';

import { DataTable } from '@/components/DataTable';
import { Transaction } from '@/types/collection';

import { TransactionType } from '@/types';
import useTransaction from '@/services/useTransaction';
import { cn } from '@/lib/utils';

export default function Transactions() {
  const { isLoading, transactions, refetch, pageCount } = useTransaction();

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => <div className=''>Rs. {row.getValue('amount')}</div>,
    },
    {
      accessorKey: 'transaction_type',
      header: 'Transaction type',
      cell: ({ row }) => {
        const type = row.getValue('transaction_type') as TransactionType;
        return (
          <p
            className={cn(
              'rounded-md border min-w-[85px] inline-block px-4 py-1',
              type === TransactionType.EXPENSE && 'bg-red-200 border-red-400',
              type === TransactionType.INCOME &&
                'bg-green-200 border-green-400',
              type === TransactionType.SAVING &&
                'bg-yellow-200 border-yellow-400',
              type === TransactionType.LOAN && 'bg-orange-200 border-orange-400'
            )}
          >
            {type}
          </p>
        );
      },
    },
    {
      accessorKey: 'transaction_date',
      header: 'Date of transaction',
      cell: ({ row }) => {
        const formatedDate = format(
          new Date(row.getValue('transaction_date')),
          'PPP'
        );
        return <p>{formatedDate}</p>;
      },
    },
  ];

  return (
    <DataTable
      isLoading={isLoading}
      data={transactions}
      columns={columns}
      pageCount={pageCount}
      refetch={refetch}
    />
  );
}
