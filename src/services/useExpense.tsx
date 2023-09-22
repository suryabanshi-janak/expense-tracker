import * as React from 'react';
import { supabase } from '@/config/supabase';
import { Expense } from '@/types/collection';
import { useExpenseStore } from '@/store/useExpenseStore';
import { DEFAULT_TABLE_LIMIT } from '@/constants';

const useExpense = () => {
  const { setExpenses } = useExpenseStore();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [expenseData, setExpenseData] = React.useState<Expense[]>([]);
  const [pageCount, setPageCount] = React.useState<number>(0);

  const fetchExpenses = React.useCallback(
    async (lower?: number, upper?: number) => {
      setIsLoading(true);
      const { data, error, count } = await supabase
        .from('expenses')
        .select(`*, categories(name, slug)`, { count: 'exact' })
        .range(lower ?? 0, upper ?? DEFAULT_TABLE_LIMIT - 1);

      if (data) {
        setExpenseData(data);
        setExpenses(data);
        setPageCount(count ? Math.ceil(count / DEFAULT_TABLE_LIMIT) : -1);
      }
      if (error) setExpenses([]);
      setIsLoading(false);
    },
    []
  );

  React.useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  return {
    isLoading,
    expenses: expenseData,
    refetch: fetchExpenses,
    pageCount,
  };
};

export default useExpense;
