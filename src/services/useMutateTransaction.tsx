import * as React from 'react';
import { supabase } from '@/config/supabase';
import { Transaction } from '@/types/collection';

const useMutateTransaction = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const createTransaction = async (transactions: Transaction[]) => {
    setIsLoading(true);
    await supabase.from('transactions').insert(transactions);
    setIsLoading(false);
  };

  return { createTransaction, isLoading };
};

export default useMutateTransaction;
