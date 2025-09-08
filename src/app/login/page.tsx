import { LoginForm } from '@/components/auth/login-form';

export const metadata = {
  title: 'Login',
};

export default function LoginPage() {
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
        <p className='px-2 text-center text-xs text-muted-foreground'>
          Having trouble? Reset your password or contact support.
        </p>
      </div>
    </div>
  );
}
