import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters.')
    .max(100, 'Name too long')
    .optional(),
  image: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
});
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters.')
      .regex(
        /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/,
        'Must include upper, lower and number.'
      ),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const deleteAccountSchema = z.object({
  password: z.string().min(1, 'Password is required').optional(),
  confirm: z.literal(true, {
    errorMap: () => ({ message: 'You must confirm deletion.' }),
  }),
});
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
