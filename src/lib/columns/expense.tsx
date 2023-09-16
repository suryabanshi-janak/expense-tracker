import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Expense } from '@/types/collection';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Icons } from '@/components/Icons';
import { format } from 'date-fns';

export const expenseColumns: ColumnDef<Expense>[] = [
  {
    accessorKey: 'description',
    header: 'Description',
  },

  // {
  //   accessorKey: 'email',
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant='ghost'
  //         onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
  //       >
  //         Email
  //         <Icons.sort className='w-4 h-4 ml-2' />
  //       </Button>
  //     );
  //   },
  //   cell: ({ row }) => <div className='lowercase'>{row.getValue('email')}</div>,
  // },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => (
      <div className='font-medium '>Rs.{row.getValue('amount')}</div>
    ),
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
      const payment = row.original;

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
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
