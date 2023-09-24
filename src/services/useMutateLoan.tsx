import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import { supabase } from '@/config/supabase';
import { getTransactionPayload } from '@/lib/modifier';
import { useAuthStore } from '@/store/useAuthStore';
import { TransactionType } from '@/types';
import { Transaction } from '@/types/collection';
import { toast } from '@/components/ui/use-toast';
import onResponse from './util';
import { LoanFormData, SingleLoanFormData } from '@/lib/validator/loan';

const getLoanPayload = (loan: SingleLoanFormData, userId: string) => {
  return {
    amount: +loan.amount,
    description: loan.description,
    user_id: userId,
    loan_date: loan.loan_date.toISOString(),
    payee_payor: loan.payee_payor,
    status: loan.status,
    loan_transaction_type: loan.loan_transaction_type,
  };
};

const useMutateLoan = () => {
  const { auth } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  const createLoan = async ({ data }: { data: LoanFormData }) => {
    setIsLoading(true);

    const newLoan = data.loans.map((loan) =>
      getLoanPayload(loan, auth!.user.id)
    );
    const res = await supabase.from('loans').insert(newLoan).select('*');

    if (res.data) {
      const transactions = res.data.map((loan) =>
        getTransactionPayload({
          type: TransactionType.LOAN,
          data: loan,
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
      successMessage: 'Loan created successfully.',
    });

    if (success) navigate('/loans');
  };

  const updateLoan = async ({
    loanId,
    data,
    transactions,
  }: {
    loanId: string;
    data: LoanFormData;
    transactions: Transaction[];
  }) => {
    setIsLoading(true);

    const loanData = getLoanPayload(data.loans[0], auth!.user.id);
    const res = await supabase
      .from('loans')
      .update(loanData)
      .eq('id', loanId)
      .select('*');

    if (res.data) {
      const loanData = res.data[0];
      const transactionPayload = getTransactionPayload({
        type: TransactionType.LOAN,
        data: loanData,
        update: true,
      });
      const transaction = transactions.find(
        (tran) => tran.loan_id === loanData.id
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
      successMessage: 'Loan updated successfully.',
    });

    if (success) navigate('/loans');
  };

  const deleteLoan = async ({ loanId }: { loanId: string }) => {
    setIsLoading(true);

    const response = await supabase.from('loans').delete().eq('id', loanId);

    return onResponse({
      response,
      setIsLoading,
      successMessage: 'Loan deleted successfully.',
    });
  };

  return { createLoan, updateLoan, isLoading, deleteLoan };
};

export default useMutateLoan;
