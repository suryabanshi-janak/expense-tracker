import { LoanStatus, LoanTransactionType } from '@/types';
import * as z from 'zod';

export const SingleLoanValidator = z.object({
  amount: z.string().min(1, {
    message: 'Amount is required',
  }),
  description: z.string().min(1, {
    message: 'Description is required',
  }),
  loan_date: z.date(),
  payee_payor: z.string().min(1, {
    message: 'Payee/Payor is required',
  }),
  status: z.nativeEnum(LoanStatus),
  loan_transaction_type: z.nativeEnum(LoanTransactionType),
});

export const LoanValidator = z.object({
  loans: z.array(SingleLoanValidator),
});

export type LoanFormData = z.infer<typeof LoanValidator>;
export type SingleLoanFormData = z.infer<typeof SingleLoanValidator>;
