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
import { PageHeader } from '@/components/dashboard/page-header';

export const metadata = {
  title: 'Settings',
};

export default async function SettingsPage() {
  await requireSession('/login');
  return (
    <div className='mx-auto w-full max-w-5xl space-y-6'>
      <PageHeader
        title='Settings'
        description='Manage your account preferences and security.'
      />

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
