import * as z from 'zod';

export const CategoryValidator = z.object({
  name: z.string(),
  subcategories: z.array(z.string()).optional(),
});

export type CategoryFormData = z.infer<typeof CategoryValidator>;
