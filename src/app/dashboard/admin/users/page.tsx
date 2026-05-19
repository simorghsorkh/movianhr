'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Search, UserCheck, UserX, RefreshCw } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useToast } from '@/contexts/ToastContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  is_active: boolean;
  created_at: string;
  mentor_status: string | null;
  trainer_status: string | null;
};

const ROLE_COLORS: Record<string, string> = {
  'job-seeker': 'info',
  mentor: 'warning',
  trainer: 'success',
  admin: 'danger',
};

export default function AdminUsersPage() {
  const { t, isRTL } = useLang();
  const toast = useToast();
  const supabase = createClient();

  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('admin_users_view')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) toast.error('Failed to load users.');
    else setUsers((data as UserRow[]) ?? []);
    setLoading(false);
  }, [supabase, toast]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const toggleActive = async (user: UserRow) => {
    setActionLoading(user.id);
    const { error } = await supabase
      .from('profiles')
      .update({ is_active: !user.is_active })
      .eq('id', user.id);
    if (error) toast.error('Failed to update user status.');
    else {
      toast.success(`${user.name} has been ${user.is_active ? 'deactivated' : 'activated'}.`);
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_active: !u.is_active } : u));
    }
    setActionLoading(null);
  };

  const filtered = users.filter(u => {
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchSearch = !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader title={t('userManagement')} subtitle="View and manage all platform users." />

      <div className="p-6 space-y-5">
        {/* Filters */}
        <div className={cn('flex flex-col sm:flex-row gap-3 items-start sm:items-center', isRTL ? 'flex-row-reverse' : '')}>
          <div className="flex-1 w-full">
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              leftIcon={<Search size={16} />}
            />
          </div>
          <div className={cn('flex gap-2 flex-wrap', isRTL ? 'flex-row-reverse' : '')}>
            {['all', 'job-seeker', 'mentor', 'trainer', 'admin'].map(r => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={cn('px-3 py-1.5 rounded-full text-sm font-medium capitalize transition-colors', roleFilter === r ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50')}
              >
                {r === 'all' ? 'All' : r.replace('-', ' ')}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={fetchUsers}>
            <RefreshCw size={14} />
          </Button>
        </div>

        {/* Count */}
        <p className="text-sm text-gray-500">{filtered.length} users found</p>

        {/* Table */}
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className={cn('px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide', isRTL ? 'text-right' : 'text-left')}>User</th>
                  <th className={cn('px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide', isRTL ? 'text-right' : 'text-left')}>Role</th>
                  <th className={cn('px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide', isRTL ? 'text-right' : 'text-left')}>Approval</th>
                  <th className={cn('px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide', isRTL ? 'text-right' : 'text-left')}>Joined</th>
                  <th className={cn('px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide', isRTL ? 'text-right' : 'text-left')}>Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => <TableRowSkeleton key={i} cols={6} />)
                  : filtered.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className={cn('flex items-center gap-3', isRTL ? 'flex-row-reverse' : '')}>
                          <Avatar name={user.name} src={user.avatar ?? undefined} size="sm" />
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={ROLE_COLORS[user.role] as any ?? 'default'}>
                          {user.role.replace('-', ' ')}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {user.mentor_status && <StatusBadge status={user.mentor_status as any} />}
                        {user.trainer_status && <StatusBadge status={user.trainer_status as any} />}
                        {!user.mentor_status && !user.trainer_status && <span className="text-xs text-gray-400">—</span>}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full', user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
                          <span className={cn('w-1.5 h-1.5 rounded-full', user.is_active ? 'bg-green-500' : 'bg-red-500')} />
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => toggleActive(user)}
                          disabled={actionLoading === user.id || user.role === 'admin'}
                          className={cn(
                            'p-1.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed',
                            user.is_active ? 'text-red-500 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'
                          )}
                          title={user.is_active ? 'Deactivate' : 'Activate'}
                        >
                          {user.is_active ? <UserX size={16} /> : <UserCheck size={16} />}
                        </button>
                      </td>
                    </tr>
                  ))
                }
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-400 text-sm">
                      No users found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
