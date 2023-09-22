import { useNavigate } from 'react-router-dom';
import { supabase } from '@/config/supabase';
import { getTransactionPayload } from '@/lib/modifier';
import { useAuthStore } from '@/store/useAuthStore';
import { TransactionType } from '@/types';
import { Saving, Transaction } from '@/types/collection';
import { SavingFormData, SingleSavingFormData } from '@/lib/validator/saving';

const getSavingPayload = (saving: SingleSavingFormData, userId: string) => {
  return {
    institution: saving.institution,
    amount: +saving.amount,
    description: saving.description,
    user_id: userId,
    saving_date: saving.saving_date.toISOString(),
  };
};

const useMutateSaving = () => {
  const { auth } = useAuthStore();
  const navigate = useNavigate();

  const createSaving = async ({
    setIsLoading,
    data,
    setError,
  }: {
    setIsLoading: (loading: boolean) => void;
    data: SavingFormData;
    setError: (error: string) => void;
  }) => {
    setIsLoading(true);

    const newSaving = data.savings.map((saving) =>
      getSavingPayload(saving, auth!.user.id)
    );
    const res = await supabase.from('savings').insert(newSaving).select('*');

    if (res.data) {
      const transactions = res.data.map((saving) =>
        getTransactionPayload({
          type: TransactionType.SAVING,
          data: saving,
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
    navigate('/savings');
  };

  const updateSaving = async ({
    setIsLoading,
    saving,
    data,
    transactions,
    setError,
  }: {
    setIsLoading: (loading: boolean) => void;
    saving: Saving;
    data: SavingFormData;
    transactions: Transaction[];
    setError: (error: string) => void;
  }) => {
    setIsLoading(true);

    const savingData = getSavingPayload(data.savings[0], auth!.user.id);
    const res = await supabase
      .from('savings')
      .update(savingData)
      .eq('id', saving.id)
      .select('*');

    if (res.data) {
      const savingData = res.data[0];
      const transactionPayload = getTransactionPayload({
        type: TransactionType.SAVING,
        data: savingData,
        update: true,
      });
      const transaction = transactions.find(
        (tran) => tran.saving_id === savingData.id
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
    navigate('/savings');
  };

  return { createSaving, updateSaving };
};

export default useMutateSaving;
