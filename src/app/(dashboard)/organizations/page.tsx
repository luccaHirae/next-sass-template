import { requireSession } from '@/lib/auth-guard';
import { CreateOrganizationForm } from '@/components/organizations/create-organization-form';
import { OrganizationList } from '@/components/organizations/organization-list';
import { OrganizationMembers } from '@/components/organizations/members';
import { OrganizationInvitations } from '@/components/organizations/invitations';
import { PageHeader } from '@/components/dashboard/page-header';

export const metadata = {
  title: 'Organizations',
};

export default async function OrganizationsPage() {
  await requireSession();
  return (
    <div className='mx-auto max-w-5xl space-y-8'>
      <section className='space-y-4'>
        <PageHeader
          title='Organizations'
          description='Create and manage your organizations.'
        />
        <CreateOrganizationForm />
      </section>

      <section className='space-y-2'>
        <h2 className='text-lg font-semibold'>Your Organizations</h2>
        <OrganizationList />
      </section>

      <section className='space-y-2'>
        <h2 className='text-lg font-semibold'>Members</h2>
        <OrganizationMembers />
      </section>

      <section className='space-y-2'>
        <h2 className='text-lg font-semibold'>Invitations</h2>
        <OrganizationInvitations />
      </section>
    </div>
  );
}
