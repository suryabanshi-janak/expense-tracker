import { useNavigate } from 'react-router-dom';
import { supabase } from '@/config/supabase';
import { getTransactionPayload } from '@/lib/modifier';
import {
  ExpenseFormData,
  SingleExpenseFormData,
} from '@/lib/validator/expense';
import { useAuthStore } from '@/store/useAuth';
import { TransactionType } from '@/types';
import { Expense, Transaction } from '@/types/collection';

const getExpensePayload = (expense: SingleExpenseFormData, userId: string) => {
  return {
    category_id: expense.category_id,
    amount: +expense.amount,
    description: expense.description,
    user_id: userId,
    payment_date: expense.payment_date.toISOString(),
  };
};

const useMutateExpense = () => {
  const { auth } = useAuthStore();
  const navigate = useNavigate();

  const createExpense = async ({
    setIsLoading,
    data,
    setError,
  }: {
    setIsLoading: (loading: boolean) => void;
    data: ExpenseFormData;
    setError: (error: string) => void;
  }) => {
    setIsLoading(true);

    const newExpenses = data.expenses.map((expense) =>
      getExpensePayload(expense, auth!.user.id)
    );
    const res = await supabase.from('expenses').insert(newExpenses).select('*');

    if (res.data) {
      const transactions = res.data.map((expense) =>
        getTransactionPayload({
          type: TransactionType.EXPENSE,
          data: expense,
        })
      );
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert(transactions);
      if (transactionError) {
        // show toaster message
      }
    }

    if (res?.error) {
      setError(res.error.message);
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    navigate('/expenses');
  };

  const updateExpense = async ({
    setIsLoading,
    expense,
    data,
    transactions,
    setError,
  }: {
    setIsLoading: (loading: boolean) => void;
    expense: Expense;
    data: ExpenseFormData;
    transactions: Transaction[];
    setError: (error: string) => void;
  }) => {
    setIsLoading(true);

    const expenseData = getExpensePayload(data.expenses[0], auth!.user.id);
    const res = await supabase
      .from('expenses')
      .update(expenseData)
      .eq('id', expense.id)
      .select('*');

    if (res.data) {
      const expenseData = res.data[0];
      const transactionPayload = getTransactionPayload({
        type: TransactionType.EXPENSE,
        data: expenseData,
        update: true,
      });
      const transaction = transactions.find(
        (tran) => tran.expense_id === expenseData.id
      );
      if (transaction) {
        const { error: transactionError } = await supabase
          .from('transactions')
          .update(transactionPayload)
          .eq('id', transaction.id);
        if (transactionError) {
          // show toaster message
        }
      }
    }

    if (res?.error) {
      setError(res.error.message);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    navigate('/expenses');
  };

  return { createExpense, updateExpense };
};
export default useMutateExpense;
