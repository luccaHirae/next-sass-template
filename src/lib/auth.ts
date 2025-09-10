import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { stripe } from '@better-auth/stripe';
import { Stripe } from 'stripe';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  user: {
    deleteUser: {
      enabled: true,
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: 'Reset your password',
        text: `Hi ${
          user.name || ''
        }\n\nClick the link below to reset your password:\n${url}\n\nIf you did not request this, you can ignore this email.`,
        html: `<p>Hi ${
          user.name || ''
        }</p><p>Click the link below to reset your password:</p><p><a href="${url}" target="_blank" rel="noopener noreferrer">Reset Password</a></p><p>If you did not request this, you can ignore this email.</p>`,
      });
    },
    onPasswordReset: async ({ user }) => {
      console.log(`Password reset for user ${user.email}`);
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: 'Verify your email address',
        text: `Hi ${
          user.name || ''
        }\n\nPlease verify your email by clicking the link below:\n${url}\n\nIf you did not create an account, you can ignore this email.`,
        html: `<p>Hi ${
          user.name || ''
        }</p><p>Please verify your email by clicking the link below:</p><p><a href="${url}" target="_blank" rel="noopener noreferrer">Verify Email</a></p><p>If you did not create an account, you can ignore this email.</p>`,
      });
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  },
  plugins: [
    stripe({
      stripeClient: new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2025-08-27.basil',
      }),
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      createCustomerOnSignUp: true,
      subscription: {
        enabled: true,
        plans: () => {
          const PRO_PRICE_ID = {
            default: process.env.STRIPE_PRO_PRICE_ID!,
            annual: process.env.STRIPE_PRO_ANNUAL_PRICE_ID!,
          };

          return [
            {
              name: 'Pro',
              priceId: PRO_PRICE_ID.default,
              annualDiscountPriceId: PRO_PRICE_ID.annual,
              freeTrial: {
                days: 7,
              },
            },
          ];
        },
      },
    }),
  ],
});
