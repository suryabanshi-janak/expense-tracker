import * as React from 'react';
import { supabase } from '@/config/supabase';
import { Income } from '@/types/collection';
import { DEFAULT_TABLE_LIMIT } from '@/constants';
import { useIncomeStore } from '@/store/useIncome';

const useIncome = () => {
  const { setIncomes } = useIncomeStore();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [incomeData, setIncomeData] = React.useState<Income[]>([]);
  const [pageCount, setPageCount] = React.useState<number>(0);

  const fetchCategories = React.useCallback(
    async (lower?: number, upper?: number) => {
      setIsLoading(true);
      const { data, count, error } = await supabase
        .from('incomes')
        .select('*')
        .range(lower ?? 0, upper ?? DEFAULT_TABLE_LIMIT - 1);

      if (data) {
        setIncomeData(data);
        setIncomes(data);
        setPageCount(count ? Math.ceil(count / DEFAULT_TABLE_LIMIT) : 0);
      }
      if (error) setIncomes([]);
      setIsLoading(false);
    },
    []
  );

  React.useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    isLoading,
    incomes: incomeData,
    refetch: fetchCategories,
    pageCount,
  };
};

export default useIncome;
