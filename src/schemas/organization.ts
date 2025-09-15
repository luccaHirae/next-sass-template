import z from 'zod';

export const createOrganizationSchema = z.object({
  name: z.string().min(2, 'Name too short'),
  slug: z
    .string()
    .min(2, 'Slug too short')
    .regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers and dashes only'),
  logo: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});
export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
