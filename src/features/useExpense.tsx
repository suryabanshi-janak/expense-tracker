import * as React from 'react';
import { supabase } from '@/config/supabase';
import { Expense } from '@/types/collection';

const useExpense = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [expenses, setExpenses] = React.useState<Expense[]>([]);

  const fetchCategories = React.useCallback(async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from('expenses')
      .select(`*, categories(name, slug)`);
    if (data) {
      setExpenses(data);
    }
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { isLoading, expenses, refetch: fetchCategories };
};

export default useExpense;
