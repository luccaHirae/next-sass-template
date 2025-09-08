'use client';

import { useSearchParams } from 'next/navigation';
import { sendVerificationEmail } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function VerifyEmailPage() {
  const search = useSearchParams();
  const email = search.get('email') || '';
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle'
  );
  const [error, setError] = useState<string | null>(null);

  async function handleResend() {
    if (!email) return;
    setError(null);
    setStatus('sending');
    try {
      const res = await sendVerificationEmail({ email, callbackURL: '/' });
      if (res?.error) {
        setError((res.error as any)?.message || 'Failed to send email');
        setStatus('error');
        return;
      }
      setStatus('sent');
    } catch (e: any) {
      setError(e?.message || 'Failed to send email');
      setStatus('error');
    }
  }

  return (
    <div className='flex min-h-[calc(100dvh-4rem)] items-center justify-center px-4 py-10'>
      <div className='w-full max-w-md space-y-8 text-center'>
        <div className='space-y-2'>
          <h1 className='text-2xl font-semibold tracking-tight'>
            Verify your email
          </h1>
          <p className='text-sm text-muted-foreground'>
            We've sent a verification link to{' '}
            <span className='font-medium'>{email || 'your email'}</span>. Click
            the link in the email to activate your account.
          </p>
        </div>
        <div className='space-y-4'>
          <Button
            onClick={handleResend}
            disabled={status === 'sending' || !email}
            className='w-full'
          >
            {status === 'sending'
              ? 'Sending...'
              : status === 'sent'
              ? 'Email sent!'
              : 'Resend verification email'}
          </Button>
          {error && (
            <p className='text-sm font-medium text-destructive'>{error}</p>
          )}
          {status === 'sent' && !error && (
            <p className='text-sm font-medium text-green-600 dark:text-green-500'>
              If it doesn't arrive, check spam and try again.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
