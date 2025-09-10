import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth-guard';
import { RegistrationForm } from '@/components/auth/registration-form';

export const metadata = {
  title: 'Register',
};

export default async function RegisterPage() {
  const session = await getSession();
  if (session) redirect('/');

  return (
    <div className='flex min-h-[calc(100dvh-4rem)] items-center justify-center px-4 py-10'>
      <div className='w-full max-w-md space-y-8'>
        <div className='space-y-2 text-center'>
          <h1 className='text-2xl font-semibold tracking-tight'>
            Create your account
          </h1>
          <p className='text-sm text-muted-foreground'>
            Start building with the SaaS template.
          </p>
        </div>
        <RegistrationForm />
        <div className='space-y-2'>
          <p className='px-2 text-center text-xs text-muted-foreground'>
            Already have an account?{' '}
            <Link
              href='/login'
              className='text-primary underline-offset-4 hover:underline'
            >
              Sign in
            </Link>
          </p>
          <p className='px-2 text-center text-xs text-muted-foreground'>
            Forgot your password?{' '}
            <Link
              href='/reset-password'
              className='text-primary underline-offset-4 hover:underline'
            >
              Reset it
            </Link>
          </p>
          <p className='px-2 text-center text-xs text-muted-foreground'>
            By creating an account you agree to our Terms of Service and Privacy
            Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
