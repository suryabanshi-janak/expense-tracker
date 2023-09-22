import { useNavigate } from 'react-router-dom';
import { supabase } from '@/config/supabase';
import { getTransactionPayload } from '@/lib/modifier';
import { useAuthStore } from '@/store/useAuth';
import { TransactionType } from '@/types';
import { Income, Transaction } from '@/types/collection';
import { IncomeFormData, SingleIncomeFormData } from '@/lib/validator/income';

const getIncomePayload = (income: SingleIncomeFormData, userId: string) => {
  return {
    amount: +income.amount,
    description: income.description,
    user_id: userId,
    income_date: income.income_date.toISOString(),
  };
};

const useMutateIncome = () => {
  const { auth } = useAuthStore();
  const navigate = useNavigate();

  const createIncome = async ({
    setIsLoading,
    data,
    setError,
  }: {
    setIsLoading: (loading: boolean) => void;
    data: IncomeFormData;
    setError: (error: string) => void;
  }) => {
    setIsLoading(true);

    const newIncome = data.incomes.map((income) =>
      getIncomePayload(income, auth!.user.id)
    );
    const res = await supabase.from('incomes').insert(newIncome).select('*');

    if (res.data) {
      const transactions = res.data.map((income) =>
        getTransactionPayload({
          type: TransactionType.INCOME,
          data: income,
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
    navigate('/incomes');
  };

  const updateIncome = async ({
    setIsLoading,
    income,
    data,
    transactions,
    setError,
  }: {
    setIsLoading: (loading: boolean) => void;
    income: Income;
    data: IncomeFormData;
    transactions: Transaction[];
    setError: (error: string) => void;
  }) => {
    setIsLoading(true);

    const incomeData = getIncomePayload(data.incomes[0], auth!.user.id);
    const res = await supabase
      .from('incomes')
      .update(incomeData)
      .eq('id', income.id)
      .select('*');

    if (res.data) {
      const incomeData = res.data[0];
      const transactionPayload = getTransactionPayload({
        type: TransactionType.INCOME,
        data: incomeData,
        update: true,
      });
      const transaction = transactions.find(
        (tran) => tran.income_id === incomeData.id
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
    navigate('/incomes');
  };

  return { createIncome, updateIncome };
};
export default useMutateIncome;
