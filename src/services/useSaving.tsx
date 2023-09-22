import * as React from 'react';
import { supabase } from '@/config/supabase';
import { DEFAULT_TABLE_LIMIT } from '@/constants';
import { Saving } from '@/types/collection';
import { useSavingStore } from '@/store/useSavingStore';

const useSaving = () => {
  const { setSavings } = useSavingStore();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [savingData, setSavingData] = React.useState<Saving[]>([]);
  const [pageCount, setPageCount] = React.useState<number>(0);

  const fetchSavings = React.useCallback(
    async (lower?: number, upper?: number) => {
      setIsLoading(true);
      const { data, count, error } = await supabase
        .from('savings')
        .select('*, saving_institutions(name)', { count: 'exact' })
        .range(lower ?? 0, upper ?? DEFAULT_TABLE_LIMIT - 1);

      if (data) {
        setSavingData(data);
        setSavings(data);
        setPageCount(count ? Math.ceil(count / DEFAULT_TABLE_LIMIT) : 0);
      }
      if (error) setSavings([]);
      setIsLoading(false);
    },
    []
  );

  React.useEffect(() => {
    fetchSavings();
  }, [fetchSavings]);

  return {
    isLoading,
    savings: savingData,
    refetch: fetchSavings,
    pageCount,
  };
};

export default useSaving;
