import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import { supabase } from '@/config/supabase';
import { getTransactionPayload } from '@/lib/modifier';
import { useAuthStore } from '@/store/useAuthStore';
import { TransactionType } from '@/types';
import { Transaction } from '@/types/collection';
import { SavingFormData, SingleSavingFormData } from '@/lib/validator/saving';
import { toast } from '@/components/ui/use-toast';
import onResponse from './util';

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
  const [isLoading, setIsLoading] = React.useState(false);

  const createSaving = async ({ data }: { data: SavingFormData }) => {
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
        toast({
          title: 'Something went wrong',
          description: transactionError.message,
          variant: 'destructive',
        });
      }
    }

    const { success } = onResponse({
      response: res,
      setIsLoading,
      successMessage: 'Saving created successfully.',
    });

    if (success) navigate('/savings');
  };

  const updateSaving = async ({
    savingId,
    data,
    transactions,
  }: {
    savingId: string;
    data: SavingFormData;
    transactions: Transaction[];
  }) => {
    setIsLoading(true);

    const savingData = getSavingPayload(data.savings[0], auth!.user.id);
    const res = await supabase
      .from('savings')
      .update(savingData)
      .eq('id', savingId)
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
          toast({
            title: 'Something went wrong',
            description: transactionError.message,
            variant: 'destructive',
          });
        }
      }
    }

    const { success } = onResponse({
      response: res,
      setIsLoading,
      successMessage: 'Saving updated successfully.',
    });

    if (success) navigate('/savings');
  };

  const deleteSaving = async ({ savingId }: { savingId: string }) => {
    setIsLoading(true);

    const response = await supabase.from('savings').delete().eq('id', savingId);

    return onResponse({
      response,
      setIsLoading,
      successMessage: 'Saving deleted successfully.',
    });
  };

  return { createSaving, updateSaving, isLoading, deleteSaving };
};

export default useMutateSaving;
