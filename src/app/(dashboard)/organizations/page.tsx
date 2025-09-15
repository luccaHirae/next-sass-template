import { requireSession } from '@/lib/auth-guard';
import { CreateOrganizationForm } from '@/components/organizations/create-organization-form';
import { OrganizationList } from '@/components/organizations/organization-list';
import { PageHeader } from '@/components/dashboard/page-header';

export const metadata = {
  title: 'Organizations',
};

export default async function OrganizationsPage() {
  await requireSession();
  return (
    <div className='space-y-8'>
      <PageHeader
        title='Organizations'
        description='Create and manage your organizations.'
      />
      <div className='grid gap-8 md:grid-cols-2'>
        <div>
          <h2 className='mb-2 text-sm font-medium uppercase text-muted-foreground'>
            Create
          </h2>
          <CreateOrganizationForm />
        </div>
        <div>
          <h2 className='mb-2 text-sm font-medium uppercase text-muted-foreground'>
            Your Organizations
          </h2>
          <OrganizationList />
        </div>
      </div>
    </div>
  );
}
