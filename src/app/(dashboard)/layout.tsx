import * as React from 'react';
import { DashboardShell } from '@/components/dashboard/shell';
import { requireSession } from '@/lib/auth-guard';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireSession('/login');
  return <DashboardShell>{children}</DashboardShell>;
}
