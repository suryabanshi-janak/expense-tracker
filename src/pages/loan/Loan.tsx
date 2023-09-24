import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { type ColumnDef } from '@tanstack/react-table';

import { Button, buttonVariants } from '@/components/ui/button';
import { DataTable } from '@/components/DataTable';
import { Loan } from '@/types/collection';
import { Icons } from '@/components/Icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import useLoan from '@/services/useLoan';
import useMutateLoan from '@/services/useMutateLoan';

export default function Loans() {
  const navigate = useNavigate();

  const { isLoading, loans, refetch, pageCount } = useLoan();
  const { deleteLoan } = useMutateLoan();

  const onDelete = async (loanId: string) => {
    const { success } = await deleteLoan({ loanId });
    if (success) await refetch();
  };

  const columns: ColumnDef<Loan>[] = [
    {
      accessorKey: 'payee_payor',
      header: 'Payee/Payor',
    },
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
      accessorKey: 'status',
      header: 'Status',
    },
    {
      accessorKey: 'loan_transaction_type',
      header: 'Transaction Type',
    },
    {
      accessorKey: 'loan_date',
      header: 'Date of loan',
      cell: ({ row }) => {
        const formatedDate = format(new Date(row.getValue('loan_date')), 'PPP');
        return <p>{formatedDate}</p>;
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const { id: loanId } = row.original;

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
                onClick={() => navigate(`/loans/create?loan_id=${loanId}`)}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(loanId)}>
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
          to='/loans/create'
          className={cn(buttonVariants({ variant: 'default' }))}
        >
          Create loan
        </Link>
      </div>

      <DataTable
        isLoading={isLoading}
        data={loans}
        columns={columns}
        pageCount={pageCount}
        refetch={refetch}
      />
    </>
  );
}
