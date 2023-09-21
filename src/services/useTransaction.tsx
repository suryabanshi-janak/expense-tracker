import * as React from 'react';
import { supabase } from '@/config/supabase';

import { Transaction } from '@/types/collection';

const useTransaction = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);

  const fetchTransactions = React.useCallback(async () => {
    const { data } = await supabase.from('transactions').select();
    if (data) {
      setTransactions(data);
    }
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return { isLoading, transactions };
};

export default useTransaction;
