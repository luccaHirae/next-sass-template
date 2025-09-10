import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth-guard';
import { LoginForm } from '@/components/auth/login-form';

export const metadata = {
  title: 'Login',
};

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect('/');

  return (
    <div className='flex min-h-[calc(100dvh-4rem)] items-center justify-center px-4 py-10'>
      <div className='w-full max-w-md space-y-8'>
        <div className='space-y-2 text-center'>
          <h1 className='text-2xl font-semibold tracking-tight'>
            Welcome back
          </h1>
          <p className='text-sm text-muted-foreground'>
            Enter your credentials to continue.
          </p>
        </div>
        <LoginForm />
        <div className='space-y-2'>
          <p className='px-2 text-center text-xs text-muted-foreground'>
            <Link
              href='/reset-password'
              className='text-primary underline-offset-4 hover:underline'
            >
              Forgot password?
            </Link>
          </p>
          <p className='px-2 text-center text-xs text-muted-foreground'>
            Don't have an account?{' '}
            <Link
              href='/register'
              className='text-primary underline-offset-4 hover:underline'
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
