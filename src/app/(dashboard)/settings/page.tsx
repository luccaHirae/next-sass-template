import { requireSession } from '@/lib/auth-guard';
import { UpdateProfileForm } from '@/components/settings/update-profile-form';
import { ChangePasswordForm } from '@/components/settings/change-password-form';
import { DeleteAccountForm } from '@/components/settings/delete-account-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

export const metadata = {
  title: 'Settings',
};

export default async function SettingsPage() {
  await requireSession('/login');
  return (
    <div className='mx-auto w-full max-w-5xl space-y-10 px-4 py-8'>
      <header className='space-y-2'>
        <h1 className='text-3xl font-semibold tracking-tight'>Settings</h1>
        <p className='text-sm text-muted-foreground'>
          Manage your account preferences and security.
        </p>
      </header>

      <div className='grid gap-8 lg:grid-cols-3'>
        <Card className='lg:col-span-2'>
          <CardHeader className='border-b'>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Update your display information and avatar.
            </CardDescription>
          </CardHeader>
          <CardContent className='pt-6'>
            <UpdateProfileForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='border-b'>
            <CardTitle>Password</CardTitle>
            <CardDescription>Change your current password.</CardDescription>
          </CardHeader>
          <CardContent className='pt-6'>
            <ChangePasswordForm />
          </CardContent>
        </Card>
      </div>

      <Card className='border-destructive/50'>
        <CardHeader className='border-b'>
          <CardTitle className='text-destructive'>Danger Zone</CardTitle>
          <CardDescription>
            Delete your account and all associated data.
          </CardDescription>
        </CardHeader>
        <CardContent className='pt-6'>
          <DeleteAccountForm />
        </CardContent>
      </Card>
    </div>
  );
}
