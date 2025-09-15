import { stripeClient } from '@better-auth/stripe/client';
import { organizationClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  sendVerificationEmail,
  requestPasswordReset,
  resetPassword,
  changePassword,
  updateUser,
  deleteUser,
} = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  plugins: [
    organizationClient(),
    stripeClient({
      subscription: true,
    }),
  ],
});
