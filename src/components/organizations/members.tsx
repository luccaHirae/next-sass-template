'use client';

import * as React from 'react';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, Trash2 } from 'lucide-react';

type Member = {
  id: string;
  userId: string;
  email?: string | null;
  name?: string | null;
  role: string;
};

interface Props {
  organizationId?: string;
}

export function OrganizationMembers({ organizationId }: Props) {
  const { data: activeOrg } = authClient.useActiveOrganization();
  const orgId = organizationId || activeOrg?.id;
  const [members, setMembers] = React.useState<Member[] | null>(null);
  const [loadingId, setLoadingId] = React.useState<string | null>(null);

  React.useEffect(() => {
    let ignore = false;
    async function load() {
      if (!orgId) return;
      const { data, error } = await authClient.organization.listMembers({
        query: { organizationId: orgId },
      });
      if (!ignore) {
        if (error) toast.error(error.message || 'Failed to load members');
        else {
          const flat = (data?.members || []).map((m: any) => ({
            id: m.id,
            userId: m.userId,
            email: m.user?.email ?? null,
            name: m.user?.name ?? null,
            role: m.role,
          }));
          setMembers(flat);
        }
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [orgId]);

  async function updateRole(memberId: string, role: string) {
    if (!orgId) return;
    setLoadingId(memberId);
    const { error } = await authClient.organization.updateMemberRole({
      organizationId: orgId,
      memberId,
      role,
    });
    setLoadingId(null);
    if (error) toast.error(error.message || 'Failed to update role');
    else {
      setMembers(
        (prev) =>
          prev?.map((m) => (m.id === memberId ? { ...m, role } : m)) || null
      );
      toast.success('Role updated');
    }
  }

  async function removeMember(memberId: string) {
    if (!orgId) return;
    if (!confirm('Remove this member?')) return;
    setLoadingId(memberId);
    const { error } = await authClient.organization.removeMember({
      organizationId: orgId,
      memberIdOrEmail: memberId,
    });
    setLoadingId(null);
    if (error) toast.error(error.message || 'Failed to remove member');
    else {
      setMembers((prev) => prev?.filter((m) => m.id !== memberId) || null);
      toast.success('Member removed');
    }
  }

  if (!orgId) return null;
  if (!members) {
    return (
      <div className='flex items-center gap-2 text-sm text-muted-foreground'>
        <Loader2 className='h-4 w-4 animate-spin' /> Loading members...
      </div>
    );
  }

  if (members.length === 0) {
    return <p className='text-sm text-muted-foreground'>No members yet.</p>;
  }

  const roleOptions = [
    { value: 'owner', label: 'Owner' },
    { value: 'admin', label: 'Admin' },
    { value: 'member', label: 'Member' },
  ];

  return (
    <div className='space-y-2'>
      {members.map((m) => (
        <div
          key={m.id}
          className='flex items-center justify-between rounded-md border p-3'
        >
          <div className='min-w-0'>
            <p className='truncate font-medium'>
              {m.name || m.email || m.userId}
            </p>
            <p className='truncate text-xs text-muted-foreground'>
              Role: {m.role}
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <Select value={m.role} onValueChange={(v) => updateRole(m.id, v)}>
              <SelectTrigger className='w-[140px]'>
                <SelectValue placeholder='Role' />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size='icon'
              variant='ghost'
              aria-label='Remove'
              disabled={loadingId === m.id}
              onClick={() => removeMember(m.id)}
            >
              <Trash2 className='h-4 w-4 text-destructive' />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
