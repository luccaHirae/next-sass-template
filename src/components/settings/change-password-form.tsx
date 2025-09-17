'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { changePassword } from '@/lib/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  type ChangePasswordInput,
  changePasswordSchema,
} from '@/schemas/profile';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function ChangePasswordForm() {
  const passwordForm = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema as any),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  const [pwStatus, setPwStatus] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle');
  const [pwError, setPwError] = useState<string | null>(null);
  async function onChangePassword(values: ChangePasswordInput) {
    setPwError(null);
    setPwStatus('saving');
    try {
      const res = await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        revokeOtherSessions: true,
      });
      if (res?.error) {
        setPwError((res.error as any)?.message || 'Failed to change password');
        setPwStatus('error');
        return;
      }
      setPwStatus('saved');
      passwordForm.reset({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setTimeout(() => setPwStatus('idle'), 1500);
    } catch (e: any) {
      setPwError(e?.message || 'Failed to change password');
      setPwStatus('error');
    }
  }

  return (
    <div className='space-y-6'>
      <h2 className='text-xl font-medium'>Change Password</h2>
      <Form {...passwordForm}>
        <form
          onSubmit={passwordForm.handleSubmit(onChangePassword)}
          className='space-y-5'
        >
          <FormField
            control={passwordForm.control}
            name='currentPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    autoComplete='current-password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={passwordForm.control}
            name='newPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    autoComplete='new-password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={passwordForm.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    autoComplete='new-password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {pwError && (
            <p className='text-sm font-medium text-destructive'>{pwError}</p>
          )}
          {pwStatus === 'saved' && !pwError && (
            <p className='text-sm font-medium text-green-600 dark:text-green-500'>
              Password updated.
            </p>
          )}
          <Button
            type='submit'
            disabled={pwStatus === 'saving'}
            className='w-full md:w-auto'
          >
            {pwStatus === 'saving' ? 'Updating...' : 'Update password'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
