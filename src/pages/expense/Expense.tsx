import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { type ColumnDef } from '@tanstack/react-table';

import useExpense from '@/services/useExpense';
import { Button, buttonVariants } from '@/components/ui/button';
import { DataTable } from '@/components/DataTable';
import useDeleteCategory from '@/services/useDeleteCategory';
import { Expense } from '@/types/collection';
import { Icons } from '@/components/Icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export default function Expenses() {
  const navigate = useNavigate();

  const { isLoading, expenses, refetch, pageCount } = useExpense();
  const { onDeleteCategory } = useDeleteCategory();

  const onDelete = async (id: string) => {
    await onDeleteCategory(id);
    await refetch();
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='w-8 h-8 p-0'>
                <span className='sr-only'>Open menu</span>
                <Icons.more className='w-4 h-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  navigate(`/expenses/create?expense_id=${expenseId}`)
                }
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(expenseId)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <div className='flex justify-end mb-4'>
        <Link
          to='/expenses/create'
          className={cn(buttonVariants({ variant: 'default' }))}
        >
          Create expense
        </Link>
      </div>

      <DataTable
        isLoading={isLoading}
        data={expenses}
        columns={columns}
        pageCount={pageCount}
        refetch={refetch}
      />
    </>
  );
}
