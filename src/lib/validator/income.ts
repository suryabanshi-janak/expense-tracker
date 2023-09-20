import * as z from 'zod';

export const SingleIncomeValidator = z.object({
  amount: z.string().min(1, {
    message: 'Amount is required',
  }),
  description: z.string().min(1, {
    message: 'Description is required',
  }),
  income_date: z.date(),
});

export const IncomeValidator = z.object({
  incomes: z.array(SingleIncomeValidator),
});

export type IncomeFormData = z.infer<typeof IncomeValidator>;
export type SingleIncomeFormData = z.infer<typeof SingleIncomeValidator>;
