import * as React from 'react';
import { Button } from '@/components/ui/button';
import CreateExpense from './CreateExpense';
import { DataTable } from '@/components/DataTable';
import useExpense from '@/features/useExpense';
import { expenseColumns } from '@/lib/columns/expense';

export default function Expense() {
  const { isLoading, expenses } = useExpense();

  const [openDialog, setOpenDialog] = React.useState(false);

  return (
    <>
      <div className='flex justify-end'>
        <Button onClick={() => setOpenDialog(true)}>Create Expense</Button>
      </div>

      <CreateExpense open={openDialog} onClose={() => setOpenDialog(false)} />

      <DataTable
        isLoading={isLoading}
        data={expenses}
        columns={expenseColumns}
      />
    </>
  );
}
