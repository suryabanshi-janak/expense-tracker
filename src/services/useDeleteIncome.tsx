import * as React from 'react';
import { supabase } from '@/config/supabase';

const useDeleteIncome = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  const onDeleteIncome = async (incomeId: string) => {
    setIsLoading(true);
    const { error } = await supabase
      .from('incomes')
      .delete()
      .eq('id', incomeId);

    if (error) {
    }

    setIsLoading(false);
  };

  return { onDeleteIncome, isLoading };
};

export default useDeleteIncome;
