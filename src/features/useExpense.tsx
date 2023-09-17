import * as React from 'react';
import { supabase } from '@/config/supabase';
import { Expense } from '@/types/collection';
import { useExpenseStore } from '@/store/useExpense';

const useExpense = () => {
  const { setExpenses } = useExpenseStore();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [expenseData, setExpenseData] = React.useState<Expense[]>([]);

  const fetchCategories = React.useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('expenses')
      .select(`*, categories(name, slug)`);
    if (data) {
      setExpenseData(data);
      setExpenses(data);
    }
    if (error) setExpenses([]);
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { isLoading, expenses: expenseData, refetch: fetchCategories };
};

export default useExpense;
