'use client';

import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2, Trash2, Pencil } from 'lucide-react';

export function OrganizationList() {
  const { data: orgs, refetch } = authClient.useListOrganizations();
  const { data: activeOrg } = authClient.useActiveOrganization();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [loading, setLoading] = useState<string | null>(null);

  async function setActive(id: string) {
    const { error } = await authClient.organization.setActive({
      organizationId: id,
    });
    if (error) toast.error(error.message);
    else toast.success('Active organization changed');
  }

  async function startEdit(org: any) {
    setEditingId(org.id);
    setEditName(org.name);
    setEditSlug(org.slug || '');
  }

  async function saveEdit() {
    if (!editingId) return;
    setLoading(editingId);
    const { error } = await authClient.organization.update({
      organizationId: editingId,
      data: { name: editName, slug: editSlug || undefined },
    });
    setLoading(null);
    if (error) toast.error(error.message || 'Update failed');
    else {
      toast.success('Updated');
      setEditingId(null);
      refetch();
    }
  }

  async function deleteOrg(id: string) {
    if (!confirm('Delete this organization?')) return;
    setLoading(id);
    const { error } = await authClient.organization.delete({
      organizationId: id,
    });
    setLoading(null);
    if (error) toast.error(error.message || 'Delete failed');
    else {
      toast.success('Deleted');
      refetch();
    }
  }

  if (!orgs) {
    return (
      <div className='flex items-center gap-2 text-sm text-muted-foreground'>
        <Loader2 className='h-4 w-4 animate-spin' /> Loading organizations...
      </div>
    );
  }

  if (orgs.length === 0) {
    return (
      <p className='text-sm text-muted-foreground'>No organizations yet.</p>
    );
  }

  return (
    <div className='space-y-4'>
      {orgs.map((org) => {
        const isEditing = editingId === org.id;
        const isActive = activeOrg?.id === org.id;
        return (
          <div
            key={org.id}
            className='flex flex-col gap-2 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between'
          >
            <div className='flex-1'>
              {isEditing ? (
                <div className='flex flex-col gap-2 sm:flex-row'>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder='Name'
                    className='sm:w-48'
                  />
                  <Input
                    value={editSlug}
                    onChange={(e) => setEditSlug(e.target.value)}
                    placeholder='slug'
                    className='sm:w-40'
                  />
                </div>
              ) : (
                <div>
                  <p className='font-medium flex items-center gap-2'>
                    {org.name}{' '}
                    {isActive && (
                      <span className='rounded bg-primary/10 px-1.5 py-0.5 text-xs text-primary'>
                        Active
                      </span>
                    )}
                  </p>
                  <p className='text-xs text-muted-foreground'>/{org.slug}</p>
                </div>
              )}
            </div>
            <div className='flex items-center gap-2'>
              {isEditing ? (
                <>
                  <Button
                    size='sm'
                    variant='secondary'
                    disabled={loading === org.id}
                    onClick={saveEdit}
                  >
                    {loading === org.id ? 'Saving...' : 'Save'}
                  </Button>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size='icon'
                    variant='ghost'
                    aria-label='Edit'
                    onClick={() => startEdit(org)}
                  >
                    <Pencil className='h-4 w-4' />
                  </Button>
                  <Button
                    size='icon'
                    variant='ghost'
                    aria-label='Delete'
                    disabled={loading === org.id}
                    onClick={() => deleteOrg(org.id)}
                  >
                    <Trash2 className='h-4 w-4 text-destructive' />
                  </Button>
                  {!isActive && (
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => setActive(org.id)}
                    >
                      Set Active
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
