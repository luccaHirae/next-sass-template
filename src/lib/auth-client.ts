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
});
