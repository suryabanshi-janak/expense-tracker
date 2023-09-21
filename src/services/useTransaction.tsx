import * as React from 'react';
import { supabase } from '@/config/supabase';

import { Transaction } from '@/types/collection';
import { DEFAULT_TABLE_LIMIT } from '@/constants';

const useTransaction = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [pageCount, setPageCount] = React.useState<number>(0);

  const fetchTransactions = React.useCallback(
    async (lower?: number, upper?: number) => {
      const { data, count } = await supabase
        .from('transactions')
        .select('*')
        .range(lower ?? 0, upper ?? DEFAULT_TABLE_LIMIT - 1);
      if (data) {
        setTransactions(data);
        setPageCount(count ? Math.ceil(count / DEFAULT_TABLE_LIMIT) : 0);
      }
      setIsLoading(false);
    },
    []
  );

  React.useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return { isLoading, transactions, refetch: fetchTransactions, pageCount };
};

export default useTransaction;
