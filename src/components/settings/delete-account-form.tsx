'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { deleteUser } from '@/lib/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  type DeleteAccountInput,
  deleteAccountSchema,
} from '@/schemas/profile';
import { cn } from '@/lib/utils';
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

export function DeleteAccountForm() {
  const deleteForm = useForm<DeleteAccountInput>({
    resolver: zodResolver(deleteAccountSchema as any),
    defaultValues: { password: '', confirm: false as any },
  });
  const [delStatus, setDelStatus] = useState<
    'idle' | 'deleting' | 'deleted' | 'error'
  >('idle');
  const [delError, setDelError] = useState<string | null>(null);

  async function onDeleteAccount(values: DeleteAccountInput) {
    setDelError(null);
    setDelStatus('deleting');
    try {
      const res = await deleteUser({
        password: values.password || undefined,
        callbackURL: '/goodbye',
      });
      if (res?.error) {
        setDelError((res.error as any)?.message || 'Failed to delete account');
        setDelStatus('error');
        return;
      }
      setDelStatus('deleted');
    } catch (e: any) {
      setDelError(e?.message || 'Failed to delete account');
      setDelStatus('error');
    }
  }

  return (
    <section className='space-y-6'>
      <h2 className='text-xl font-medium text-destructive'>Danger Zone</h2>
      <Form {...deleteForm}>
        <form
          onSubmit={deleteForm.handleSubmit(onDeleteAccount)}
          className='space-y-5 max-w-md'
        >
          <FormField
            control={deleteForm.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password (optional)</FormLabel>
                <FormControl>
                  <Input type='password' placeholder='••••••••' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={deleteForm.control}
            name='confirm'
            render={({ field }) => (
              <FormItem>
                <div className='flex items-center space-x-2'>
                  <input
                    type='checkbox'
                    className='h-4 w-4 rounded border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50'
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                  <FormLabel className={cn('!mt-0')}>
                    I understand this action is irreversible
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          {delError && (
            <p className='text-sm font-medium text-destructive'>{delError}</p>
          )}
          {delStatus === 'deleted' && !delError && (
            <p className='text-sm font-medium text-green-600 dark:text-green-500'>
              Account deleted.
            </p>
          )}
          <Button
            type='submit'
            variant='destructive'
            disabled={
              delStatus === 'deleting' ||
              delStatus === 'deleted' ||
              !deleteForm.watch('confirm')
            }
            className='w-full md:w-auto'
          >
            {delStatus === 'deleting' ? 'Deleting...' : 'Delete account'}
          </Button>
        </form>
      </Form>
    </section>
  );
}
