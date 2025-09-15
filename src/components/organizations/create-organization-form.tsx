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

export function CreateOrganizationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<CreateOrganizationInput>({
    // Casting schema due to atypical local zod resolver type inference mismatch
    resolver: zodResolver(createOrganizationSchema as any),
    defaultValues: { name: '', slug: '', logo: '' },
  });
  const slugValue = watch('slug');
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
      setValue('name', '');
      setValue('slug', '');
      setValue('logo', '');
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='space-y-4 rounded-lg border p-4'
    >
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Name</label>
        <Input placeholder='Acme Inc' {...register('name')} />
        {errors.name && (
          <p className='text-xs text-destructive'>{errors.name.message}</p>
        )}
      </div>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Slug</label>
        <div className='flex gap-2'>
          <Input
            placeholder='acme'
            {...register('slug')}
            onBlur={() => checkSlug(slugValue)}
          />
          <Button
            type='button'
            variant='outline'
            disabled={checking || !slugValue}
            onClick={() => checkSlug(slugValue)}
          >
            {checking ? 'Checking...' : 'Check'}
          </Button>
        </div>
        {errors.slug && (
          <p className='text-xs text-destructive'>{errors.slug.message}</p>
        )}
      </div>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Logo URL (optional)</label>
        <Input placeholder='https://...' {...register('logo')} />
        {errors.logo && (
          <p className='text-xs text-destructive'>{errors.logo.message}</p>
        )}
      </div>
      <Button type='submit' disabled={isSubmitting} className='w-full'>
        {isSubmitting ? 'Creating...' : 'Create Organization'}
      </Button>
    </form>
  );
}
