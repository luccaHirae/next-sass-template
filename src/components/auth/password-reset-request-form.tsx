'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  passwordResetRequestSchema,
  type PasswordResetRequestInput,
} from '@/schemas/auth';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { requestPasswordReset } from '@/lib/auth-client';

export function PasswordResetRequestForm() {
  const form = useForm<PasswordResetRequestInput>({
    resolver: zodResolver(passwordResetRequestSchema as any),
    defaultValues: { email: '' },
  });

  const [submitting, setSubmitting] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(values: PasswordResetRequestInput) {
    setError(null);
    setSent(false);
    try {
      setSubmitting(true);
      const res = await requestPasswordReset({
        email: values.email,
        redirectTo: `${window.location.origin}/reset-password/confirm`,
      });
      if (res?.error) {
        setError((res.error as any)?.message || 'Failed to send reset email.');
        return;
      }
      setSent(true);
    } catch (e: any) {
      setError(e?.message || 'Failed to send reset email.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
        <div className='space-y-4'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='you@example.com'
                    autoComplete='email'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && (
            <p className='text-sm font-medium text-destructive'>{error}</p>
          )}
          {sent && !error && (
            <p className='text-sm font-medium text-green-600 dark:text-green-500'>
              If that email exists, a reset link has been sent.
            </p>
          )}
        </div>
        <Button type='submit' className='w-full' disabled={submitting}>
          {submitting ? 'Sending...' : 'Send reset link'}
        </Button>
      </form>
    </Form>
  );
}
