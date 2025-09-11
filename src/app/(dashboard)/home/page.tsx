import { PageHeader } from '@/components/dashboard/page-header';
import * as React from 'react';

export default function DashboardHome() {
  return (
    <div className='space-y-6'>
      <PageHeader title='Dashboard' description='Your overview at a glance.' />

      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        <Card title='Users' value='—' />
        <Card title='Revenue' value='$ —' />
        <Card title='Churn' value='— %' />
      </div>

      <div className='rounded-lg border p-4'>
        <p className='text-sm text-muted-foreground'>
          Add charts or recent activity here.
        </p>
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className='rounded-lg border p-4'>
      <div className='text-sm text-muted-foreground'>{title}</div>
      <div className='mt-2 text-2xl font-semibold'>{value}</div>
    </div>
  );
}
