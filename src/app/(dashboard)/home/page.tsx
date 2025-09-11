import * as React from 'react';

export default function DashboardHome() {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-semibold tracking-tight'>Dashboard</h1>
        <p className='text-sm text-muted-foreground'>
          Your overview at a glance.
        </p>
      </div>

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
