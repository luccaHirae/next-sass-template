'use client';

import * as React from 'react';
import {
  type UpdateProfileInput,
  updateProfileSchema,
} from '@/schemas/profile';
import { useForm } from 'react-hook-form';
import { updateUser, useSession } from '@/lib/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
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

export function UpdateProfileForm() {
  const { data: session } = useSession();
  const user = session?.user;

  const profileForm = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema as any),
    defaultValues: { name: user?.name || '', image: user?.image || '' },
  });

  React.useEffect(() => {
    profileForm.reset({ name: user?.name || '', image: user?.image || '' });
  }, [user?.name, user?.image]);

  const [profileStatus, setProfileStatus] = React.useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle');
  const [profileError, setProfileError] = React.useState<string | null>(null);

  async function onUpdateProfile(values: UpdateProfileInput) {
    setProfileError(null);
    setProfileStatus('saving');
    try {
      const res = await updateUser({
        name: values.name,
        image: values.image || undefined,
      });
      if (res?.error) {
        setProfileError(
          (res.error as any)?.message || 'Failed to update profile'
        );
        setProfileStatus('error');
        return;
      }
      setProfileStatus('saved');
      setTimeout(() => setProfileStatus('idle'), 1500);
    } catch (e: any) {
      setProfileError(e?.message || 'Failed to update profile');
      setProfileStatus('error');
    }
  }

  return (
    <div className='space-y-6'>
      <h2 className='text-xl font-medium'>Profile</h2>
      <Form {...profileForm}>
        <form
          onSubmit={profileForm.handleSubmit(onUpdateProfile)}
          className='space-y-5'
        >
          <FormField
            control={profileForm.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder='Your name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={profileForm.control}
            name='image'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Image URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder='https://example.com/avatar.png'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <label className='text-sm font-medium'>Email</label>
            <p className='mt-1 text-sm text-muted-foreground break-all'>
              {user?.email || '—'}
            </p>
          </div>
          {profileError && (
            <p className='text-sm font-medium text-destructive'>
              {profileError}
            </p>
          )}
          {profileStatus === 'saved' && !profileError && (
            <p className='text-sm font-medium text-green-600 dark:text-green-500'>
              Saved.
            </p>
          )}
          <Button
            type='submit'
            disabled={profileStatus === 'saving'}
            className='w-full md:w-auto'
          >
            {profileStatus === 'saving' ? 'Saving...' : 'Save changes'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
