import { LayoutGrid, Settings, CreditCard, Building2 } from 'lucide-react';

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
    items: [{ title: 'Overview', href: '/home', icon: LayoutGrid }],
  },
  {
    title: 'Manage',
    items: [
      { title: 'Settings', href: '/settings', icon: Settings },
      { title: 'Organizations', href: '/organizations', icon: Building2 },
      { title: 'Billing', href: '/billing', icon: CreditCard },
    ],
  },
];
