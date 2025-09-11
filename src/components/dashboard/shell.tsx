'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useSession, signOut, signIn } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { Menu, X, Settings, LogOut } from 'lucide-react';
import { sidebarNav } from '@/config/nav';

interface Props {
  children: React.ReactNode;
}

export function DashboardShell({ children }: Props) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    // close on route change
    setOpen(false);
  }, [pathname]);

  return (
    <div className='min-h-dvh bg-background text-foreground'>
      {/* Header */}
      <header className='sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='mx-auto flex h-14 w-full max-w-7xl items-center gap-3 px-4'>
          <Button
            variant='ghost'
            size='icon'
            className='md:hidden'
            aria-label='Toggle sidebar'
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
          </Button>
          <Link href='/' className='font-semibold'>
            SaaS
          </Link>
          <HeaderActions />
        </div>
      </header>

      {/* Body */}
      <div className='mx-auto grid w-full max-w-7xl grid-cols-1 md:grid-cols-[240px_1fr]'>
        {/* Sidebar (desktop) */}
        <aside className='sticky top-14 hidden h-[calc(100dvh-56px)] border-r md:block'>
          <nav className='flex h-full flex-col gap-3 p-3'>
            {sidebarNav.map((group) => (
              <div key={group.title} className='space-y-1'>
                <div className='px-3 text-xs font-medium uppercase tracking-wide text-muted-foreground'>
                  {group.title}
                </div>
                {group.items.map((item) => (
                  <SidebarLink
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    active={pathname === item.href}
                  >
                    {item.title}
                  </SidebarLink>
                ))}
              </div>
            ))}
          </nav>
        </aside>

        {/* Sidebar (mobile drawer) */}
        <div
          className={cn(
            'fixed inset-0 z-30 bg-background/60 backdrop-blur-sm transition-opacity md:hidden',
            open
              ? 'pointer-events-auto opacity-100'
              : 'pointer-events-none opacity-0'
          )}
          onClick={() => setOpen(false)}
        />
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-40 w-72 translate-x-[-100%] border-r bg-background p-3 transition-transform md:hidden',
            open && 'translate-x-0'
          )}
          aria-hidden={!open}
        >
          <nav className='flex h-full flex-col gap-3'>
            {sidebarNav.map((group) => (
              <div key={group.title} className='space-y-1'>
                <div className='px-3 text-xs font-medium uppercase tracking-wide text-muted-foreground'>
                  {group.title}
                </div>
                {group.items.map((item) => (
                  <SidebarLink
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    active={pathname === item.href}
                    onClick={() => setOpen(false)}
                  >
                    {item.title}
                  </SidebarLink>
                ))}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className='min-h-[calc(100dvh-56px)] p-4 md:p-6'>{children}</main>
      </div>
    </div>
  );
}

function HeaderActions() {
  const { data: session } = useSession();
  const user = session?.user;
  const name = user?.name || user?.email || 'User';
  const initials = name
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const router = useRouter();

  return (
    <div className='ml-auto flex items-center gap-3'>
      <div className='hidden sm:block'>
        <Input placeholder='Search...' className='h-9 w-56' />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='relative h-9 w-9 rounded-full p-0'>
            <Avatar className='h-9 w-9'>
              {user?.image ? <AvatarImage src={user.image} alt={name} /> : null}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <span className='sr-only'>Open user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-56'>
          <div className='px-2 py-1.5 text-xs text-muted-foreground'>
            Signed in as
            <div className='truncate text-foreground text-sm font-medium'>
              {name}
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href='/settings' className='w-full'>
              <Settings className='mr-2 h-4 w-4' />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={async (e) => {
              e.preventDefault();
              await signOut({
                fetchOptions: {
                  onSuccess: () => {
                    router.push('/login');
                  },
                },
              });
            }}
          >
            <LogOut className='mr-2 h-4 w-4' />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function SidebarLink({
  href,
  active,
  children,
  icon: Icon,
  onClick,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
  icon?: React.ComponentType<any>;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground',
        active ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
      )}
    >
      {Icon ? <Icon className='h-4 w-4' /> : null}
      <span>{children}</span>
    </Link>
  );
}
