'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterInput } from '@/schemas/auth';
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
import { signUp } from '@/lib/auth-client';

interface ApiError {
  message: string;
  fieldErrors?: Record<string, string | undefined>;
}
export function RegistrationForm() {
  const form = useForm<RegisterInput>({
    // Cast due to compatibility nuance between current zod + resolver types
    resolver: zodResolver(registerSchema as any),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const [submitting, setSubmitting] = React.useState(false);
  const [apiError, setApiError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  async function handleSubmit(values: RegisterInput) {
    setApiError(null);
    setSuccess(false);
    try {
      setSubmitting(true);
      // better-auth signUp expects at least email + password, optionally name
      const res = await signUp.email({
        email: values.email,
        password: values.password,
        name: values.name,
      });
      if (res?.error) {
        const err: ApiError = res.error as any;
        setApiError(err.message || 'Registration failed');
        return;
      }
      setSuccess(true);
      form.reset({ name: '', email: '', password: '', confirmPassword: '' });
    } catch (e: any) {
      setApiError(e?.message || 'Unexpected error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const disabled = submitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
        <div className='space-y-4'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Jane Doe'
                    autoComplete='name'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
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
          {apiError && (
            <p className='text-sm font-medium text-destructive'>{apiError}</p>
          )}
          {success && !apiError && (
            <p className='text-sm font-medium text-green-600 dark:text-green-500'>
              Account created! You can now verify your email or sign in.
            </p>
          )}
        </div>
        <Button type='submit' className='w-full' disabled={disabled}>
          {disabled ? 'Creating account...' : 'Create account'}
        </Button>
      </form>
    </Form>
  );
}
