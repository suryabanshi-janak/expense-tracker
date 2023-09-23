import * as z from 'zod';

export const SavingInstitutionValidator = z.object({
  name: z.string().min(1, { message: 'Please enter institution name' }),
});

export type SavingInstitutionFormData = z.infer<
  typeof SavingInstitutionValidator
>;
