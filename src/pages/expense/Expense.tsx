import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { type ColumnDef } from '@tanstack/react-table';

import useExpense from '@/features/useExpense';
import { Button, buttonVariants } from '@/components/ui/button';
import { DataTable } from '@/components/DataTable';
import useDeleteCategory from '@/features/useDeleteCategory';
import { Expense } from '@/types/collection';
import { Icons } from '@/components/Icons';
import { cn } from '@/lib/utils';

export default function Expenses() {
  const navigate = useNavigate();

  const { isLoading, expenses, refetch } = useExpense();
  const { onDeleteCategory, isLoading: isDeleteLoading } = useDeleteCategory();

  const [mutationId, setMutationId] = React.useState<string>('');

  const onDelete = async (id: string) => {
    setMutationId(id);
    await onDeleteCategory(id);
    await refetch();
    setMutationId('');
  };

  const columns: ColumnDef<Expense>[] = [
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
      accessorKey: 'payment_date',
      header: 'Date of expense',
      cell: ({ row }) => {
        const formatedDate = format(
          new Date(row.getValue('payment_date')),
          'PPP'
        );
        return <p>{formatedDate}</p>;
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const { id: expenseId } = row.original;

        return (
          <div className='flex items-center justify-center gap-2'>
            <Button
              variant='ghost'
              onClick={() => navigate('/expenses/create')}
            >
              <Icons.copy className='w-4 h-4' />
            </Button>

            <Button
              variant='ghost'
              onClick={() => onDelete(expenseId)}
              disabled={isDeleteLoading && mutationId === expenseId}
            >
              {isDeleteLoading && mutationId === expenseId ? (
                <Icons.spinner className='w-4 h-4 animate-spin' />
              ) : (
                <Icons.delete className='w-4 h-4' />
              )}
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className='flex justify-end'>
        <Link
          to='/expenses/create'
          className={cn(buttonVariants({ variant: 'default' }))}
        >
          Create expense
        </Link>
      </div>

      <DataTable isLoading={isLoading} data={expenses} columns={columns} />
    </>
  );
}
