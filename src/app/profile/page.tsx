import { DeleteAccountForm } from '@/components/settings/delete-account-form';
import { ChangePasswordForm } from '@/components/settings/change-password-form';
import { UpdateProfileForm } from '@/components/settings/update-profile-form';

export const metadata = {
  title: 'Profile Settings',
};

export default function ProfilePage() {
  return (
    <div className='mx-auto w-full max-w-4xl space-y-12 px-4 py-10'>
      <header className='space-y-1'>
        <h1 className='text-3xl font-semibold tracking-tight'>
          Profile Settings
        </h1>
        <p className='text-sm text-muted-foreground'>
          Manage your personal information and security.
        </p>
      </header>

      <section className='grid gap-12 md:grid-cols-2'>
        {/* Profile Info */}
        <UpdateProfileForm />

        {/* Change Password */}
        <ChangePasswordForm />
      </section>

      <DeleteAccountForm />
    </div>
  );
}
