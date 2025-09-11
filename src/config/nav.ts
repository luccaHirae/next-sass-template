import { LayoutGrid, Settings, CreditCard } from 'lucide-react';

export type NavItem = {
  title: string;
  href: string;
  icon?: React.ComponentType<any>;
  badge?: string;
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

export const sidebarNav: NavGroup[] = [
  {
    title: 'General',
    items: [{ title: 'Overview', href: '/dashboard', icon: LayoutGrid }],
  },
  {
    title: 'Manage',
    items: [
      { title: 'Settings', href: '/settings', icon: Settings },
      { title: 'Billing', href: '/billing', icon: CreditCard },
    ],
  },
];
