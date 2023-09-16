import * as React from 'react';
import { supabase } from '@/config/supabase';
import { Expense } from '@/types/collection';

const useExpense = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [expenses, setExpenses] = React.useState<Expense[]>([]);

  const fetchCategories = React.useCallback(async () => {
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

  return { isLoading, expenses };
};

export default useExpense;
