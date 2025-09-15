'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import {
  type CreateOrganizationInput,
  createOrganizationSchema,
} from '@/schemas/organization';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';

export function CreateOrganizationForm() {
  const form = useForm<CreateOrganizationInput>({
    resolver: zodResolver(createOrganizationSchema as any),
    defaultValues: { name: '', slug: '', logo: '' },
  });
  const slugValue = form.watch('slug');
  const [checking, setChecking] = React.useState(false);

  async function checkSlug(slug: string) {
    if (!slug) return;
    setChecking(true);
    const { data, error } = await authClient.organization.checkSlug({ slug });
    setChecking(false);
    if (error) {
      toast.error(error.message || 'Slug check failed');
      return;
    }
    if (data?.status === false) {
      toast.success('Slug available');
    } else {
      toast.error('Slug already taken');
    }
  }

  async function onSubmit(values: CreateOrganizationInput) {
    const { name, slug, logo } = values;
    const { error } = await authClient.organization.create({
      name,
      slug,
      logo: logo || undefined,
    });
    if (error) {
      toast.error(error.message || 'Failed to create organization');
    } else {
      toast.success('Organization created');
      form.reset({ name: '', slug: '', logo: '' });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-6 rounded-lg border p-4'
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='Acme Inc' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='slug'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <div className='flex gap-2'>
                  <Input
                    placeholder='acme'
                    {...field}
                    onBlur={() => checkSlug(field.value)}
                  />
                  <Button
                    type='button'
                    variant='outline'
                    disabled={checking || !slugValue}
                    onClick={() => checkSlug(field.value)}
                  >
                    {checking ? 'Checking...' : 'Check'}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='logo'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo URL (optional)</FormLabel>
              <FormControl>
                <Input placeholder='https://...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type='submit'
          disabled={form.formState.isSubmitting}
          className='w-full'
        >
          {form.formState.isSubmitting ? 'Creating...' : 'Create Organization'}
        </Button>
      </form>
    </Form>
  );
}
