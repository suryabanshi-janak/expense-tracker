import * as React from 'react';
import { Button } from '@/components/ui/button';
import CreateExpense from './CreateExpense';

export default function Expense() {
  const [openDialog, setOpenDialog] = React.useState(false);

  return (
    <>
      <div className='flex justify-end'>
        <Button onClick={() => setOpenDialog(true)}>Create Expense</Button>
      </div>

      <CreateExpense open={openDialog} onClose={() => setOpenDialog(false)} />
    </>
  );
}
