'use client';

import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2, XCircle } from 'lucide-react';

interface Props {
  organizationId?: string;
}

export function OrganizationInvitations({ organizationId }: Props) {
  const { data: activeOrg } = authClient.useActiveOrganization();
  const orgId = organizationId || activeOrg?.id;
  const [invites, setInvites] = useState<any[] | null>(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function load() {
      if (!orgId) return;
      const { data, error } = await authClient.organization.listInvitations({
        query: { organizationId: orgId },
      });
      if (!ignore) {
        if (error) toast.error(error.message || 'Failed to load invitations');
        else setInvites(data || []);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [orgId]);

  async function invite() {
    if (!orgId || !email) return;
    setLoading(true);
    const { error } = await authClient.organization.inviteMember({
      email,
      role: 'member',
      organizationId: orgId,
    });
    setLoading(false);
    if (error) toast.error(error.message || 'Invite failed');
    else {
      toast.success('Invitation sent');
      setEmail('');
      // refresh
      const { data } = await authClient.organization.listInvitations({
        query: { organizationId: orgId },
      });
      setInvites(data || []);
    }
  }

  async function cancel(invitationId: string) {
    if (!orgId) return;
    const { error } = await authClient.organization.cancelInvitation({
      invitationId,
    });
    if (error) toast.error(error.message || 'Cancel failed');
    else {
      toast.success('Invitation canceled');
      setInvites((prev) => prev?.filter((i) => i.id !== invitationId) || null);
    }
  }

  if (!orgId) return null;
  if (!invites) {
    return (
      <div className='flex items-center gap-2 text-sm text-muted-foreground'>
        <Loader2 className='h-4 w-4 animate-spin' /> Loading invitations...
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-2'>
        <Input
          type='email'
          placeholder='email@company.com'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='max-w-sm'
        />
        <Button onClick={invite} disabled={loading || !email}>
          {loading ? 'Sending...' : 'Invite'}
        </Button>
      </div>

      {invites.length === 0 ? (
        <p className='text-sm text-muted-foreground'>No pending invitations.</p>
      ) : (
        <div className='space-y-2'>
          {invites.map((i) => (
            <div
              key={i.id}
              className='flex items-center justify-between rounded-md border p-3'
            >
              <div>
                <p className='font-medium'>{i.email}</p>
                <p className='text-xs text-muted-foreground'>
                  Invited by {i.inviter?.email || i.inviterId}
                </p>
              </div>
              <Button
                size='icon'
                variant='ghost'
                aria-label='Cancel invitation'
                onClick={() => cancel(i.id)}
              >
                <XCircle className='h-4 w-4 text-destructive' />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
