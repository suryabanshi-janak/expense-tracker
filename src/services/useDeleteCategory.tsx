import * as React from 'react';
import { supabase } from '@/config/supabase';

const useDeleteCategory = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  const onDeleteCategory = async (expenseId: string) => {
    setIsLoading(true);
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', expenseId);

    if (error) {
    }

    setIsLoading(false);
  };

  return { onDeleteCategory, isLoading };
};

export default useDeleteCategory;
