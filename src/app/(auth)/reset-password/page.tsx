import { PasswordResetRequestForm } from '@/components/auth/password-reset-request-form';
import Link from 'next/link';

export const metadata = {
  title: 'Reset Password'
};

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Reset your password</h1>
          <p className="text-sm text-muted-foreground">Enter your email to receive a reset link.</p>
        </div>
        <PasswordResetRequestForm />
        <div className="text-center text-sm">
          <Link href="/login" className="text-primary underline-offset-4 hover:underline">Back to login</Link>
        </div>
      </div>
    </div>
  );
}
