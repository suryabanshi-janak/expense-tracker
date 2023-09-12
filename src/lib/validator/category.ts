import * as z from 'zod';

export const CategoryValidator = z.object({
  name: z.string().min(1, {
    message: 'Category Name is required.',
  }),
  description: z.string().optional(),
  subcategories: z
    .array(z.object({ name: z.string(), description: z.string() }))
    .optional(),
});

export type CategoryFormData = z.infer<typeof CategoryValidator>;
