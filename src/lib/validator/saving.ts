import * as z from 'zod';

export const SingleSavingValidator = z.object({
  institution: z.string().min(1, {
    message: 'Please select institution',
  }),
  amount: z.string().min(1, {
    message: 'Amount is required',
  }),
  description: z.string().min(1, {
    message: 'Description is required',
  }),
  saving_date: z.date(),
});

export const SavingValidator = z.object({
  savings: z.array(SingleSavingValidator),
});

export type SavingFormData = z.infer<typeof SavingValidator>;
export type SingleSavingFormData = z.infer<typeof SingleSavingValidator>;
