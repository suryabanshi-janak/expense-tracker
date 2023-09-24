import * as React from 'react';
import { supabase } from '@/config/supabase';
import { DEFAULT_TABLE_LIMIT } from '@/constants';
import { useLoanStore } from '@/store/useLoanStore';
import { Loan } from '@/types/collection';

const useLoan = () => {
  const { setLoans } = useLoanStore();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [loanData, setLoanData] = React.useState<Loan[]>([]);
  const [pageCount, setPageCount] = React.useState<number>(0);

  const fetchLoans = React.useCallback(
    async (lower?: number, upper?: number) => {
      setIsLoading(true);
      const { data, count, error } = await supabase
        .from('loans')
        .select('*')
        .range(lower ?? 0, upper ?? DEFAULT_TABLE_LIMIT - 1);

      if (data) {
        setLoanData(data);
        setLoans(data);
        setPageCount(count ? Math.ceil(count / DEFAULT_TABLE_LIMIT) : 0);
      }
      if (error) setLoans([]);
      setIsLoading(false);
    },
    []
  );

  React.useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  return {
    isLoading,
    loans: loanData,
    refetch: fetchLoans,
    pageCount,
  };
};

export default useLoan;
