import * as z from 'zod';

export const SingleExpenseValidator = z.object({
  category_id: z.string().min(1, {
    message: 'Category is required',
  }),
  amount: z.string().min(1, {
    message: 'Amount is required',
  }),
  description: z.string().min(1, {
    message: 'Description is required',
  }),
  payment_date: z.date(),
});

export const ExpenseValidator = z.object({
  expenses: z.array(SingleExpenseValidator),
});

export type ExpenseFormData = z.infer<typeof ExpenseValidator>;
export type SingleExpenseFormData = z.infer<typeof SingleExpenseValidator>;
