import { RegistrationForm } from '@/components/auth/registration-form';

export const metadata = {
  title: 'Register',
};

export default function RegisterPage() {
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
        <p className='px-2 text-center text-xs text-muted-foreground'>
          By creating an account you agree to our Terms of Service and Privacy
          Policy.
        </p>
      </div>
    </div>
  );
}
