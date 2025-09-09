'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { resetPassword } from '@/lib/auth-client';
import { useState, useEffect } from 'react';
import { type NewPasswordInput, newPasswordSchema } from '@/schemas/auth';

export function PasswordResetConfirmForm() {
  const search = useSearchParams();
  const router = useRouter();
  const token = search.get('token');

  const form = useForm<NewPasswordInput>({
    resolver: zodResolver(newPasswordSchema as any),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Missing or invalid token.');
    }
  }, [token]);

  async function onSubmit(values: NewPasswordInput) {
    if (!token) return;
    setSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await resetPassword({ newPassword: values.password, token });
      if (res?.error) {
        setError((res.error as any)?.message || 'Failed to reset password');
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push('/login'), 1200);
    } catch (e: any) {
      setError(e?.message || 'Failed to reset password');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className='flex min-h-[calc(100dvh-4rem)] items-center justify-center px-4 py-10'>
      <div className='w-full max-w-md space-y-8'>
        <div className='space-y-2 text-center'>
          <h1 className='text-2xl font-semibold tracking-tight'>
            Set a new password
          </h1>
          <p className='text-sm text-muted-foreground'>
            Enter and confirm your new password.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='space-y-4'>
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='********'
                        autoComplete='new-password'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='********'
                        autoComplete='new-password'
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
              {success && !error && (
                <p className='text-sm font-medium text-green-600 dark:text-green-500'>
                  Password updated! Redirecting…
                </p>
              )}
            </div>
            <Button
              type='submit'
              disabled={submitting || !token}
              className='w-full'
            >
              {submitting ? 'Updating...' : 'Update password'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
