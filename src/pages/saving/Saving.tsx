import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { type ColumnDef } from '@tanstack/react-table';

import { Button, buttonVariants } from '@/components/ui/button';
import { DataTable } from '@/components/DataTable';
import { Icons } from '@/components/Icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import useSaving from '@/services/useSaving';
import { Saving } from '@/types/collection';

export default function Savings() {
  const navigate = useNavigate();

  const { isLoading, savings, refetch, pageCount } = useSaving();
  // const { onDeleteIncome } = useDeleteIncome();

  const onDelete = async (id: string) => {
    // await onDeleteIncome(id);
    // await refetch();
  };

  const columns: ColumnDef<Saving>[] = [
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
    },
    {
      accessorKey: 'institution',
      header: 'Instituion',
      cell: ({ row }) => (
        <div className=''>Rs. {row.getValue('institution')}</div>
      ),
    },
    {
      accessorKey: 'saving',
      header: 'Date of saving',
      cell: ({ row }) => {
        const formatedDate = format(new Date(row.getValue('saving')), 'PPP');
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
      <div className='flex justify-end gap-4 mb-4'>
        <Link
          to='/savings/create'
          className={cn(buttonVariants({ variant: 'default' }))}
        >
          Create saving
        </Link>
        <Link
          to='/savings/institutions'
          className={cn(buttonVariants({ variant: 'secondary' }))}
        >
          View institutions
        </Link>
      </div>

      <DataTable
        isLoading={isLoading}
        data={savings}
        columns={columns}
        pageCount={pageCount}
        refetch={refetch}
      />
    </>
  );
}
