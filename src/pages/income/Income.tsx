import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { type ColumnDef } from '@tanstack/react-table';

import { Button, buttonVariants } from '@/components/ui/button';
import { DataTable } from '@/components/DataTable';
import { Income } from '@/types/collection';
import { Icons } from '@/components/Icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import useIncome from '@/services/useIncome';
import useDeleteIncome from '@/services/useDeleteIncome';

export default function Incomes() {
  const navigate = useNavigate();

  const { isLoading, incomes, refetch, pageCount } = useIncome();
  const { onDeleteIncome } = useDeleteIncome();

  const onDelete = async (id: string) => {
    await onDeleteIncome(id);
    await refetch();
  };

  const columns: ColumnDef<Income>[] = [
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
      accessorKey: 'income_date',
      header: 'Date of income',
      cell: ({ row }) => {
        const formatedDate = format(
          new Date(row.getValue('income_date')),
          'PPP'
        );
        return <p>{formatedDate}</p>;
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const { id: incomeId } = row.original;

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
                  navigate(`/incomes/create?income_id=${incomeId}`)
                }
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(incomeId)}>
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
          to='/incomes/create'
          className={cn(buttonVariants({ variant: 'default' }))}
        >
          Create income
        </Link>
      </div>

      <DataTable
        isLoading={isLoading}
        data={incomes}
        columns={columns}
        pageCount={pageCount}
        refetch={refetch}
      />
    </>
  );
}
