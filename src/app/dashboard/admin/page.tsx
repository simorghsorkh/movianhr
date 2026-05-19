'use client';

import React, { useEffect, useState } from 'react';
import { Users, BookOpen, MessageSquare, TrendingUp, UserCheck, AlertCircle, Shield, RefreshCw } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useToast } from '@/contexts/ToastContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { StatCardSkeleton, CardSkeleton } from '@/components/ui/Skeleton';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface AdminStats {
  total_users: number;
  job_seekers: number;
  mentors: number;
  trainers: number;
  pending_mentors: number;
  pending_trainers: number;
  pending_courses: number;
  total_courses: number;
  total_requests: number;
  pending_requests: number;
}

interface PendingItem {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  type: 'mentor' | 'trainer';
}

interface RecentRequest {
  id: string;
  subject: string;
  status: string;
  created_at: string;
  seeker_name: string;
  mentor_name: string;
}

export default function AdminDashboardPage() {
  const { t, isRTL } = useLang();
  const toast = useToast();
  const supabase = createClient();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [recentRequests, setRecentRequests] = useState<RecentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [statsRes, mentorsRes, trainersRes, reqsRes] = await Promise.all([
        supabase.from('admin_stats_view').select('*').single(),
        supabase.from('mentor_profiles').select('id, profiles(name, email, avatar)').eq('approval_status', 'pending').limit(5),
        supabase.from('trainer_profiles').select('id, profiles(name, email, avatar)').eq('approval_status', 'pending').limit(5),
        supabase.from('consultation_requests').select('id, subject, status, created_at, seeker:job_seeker_id(name), mentor:mentor_id(name)').order('created_at', { ascending: false }).limit(5),
      ]);

      if (statsRes.data) setStats(statsRes.data as unknown as AdminStats);

      const combined: PendingItem[] = [
        ...(mentorsRes.data ?? []).map((m: any) => ({ id: m.id, name: m.profiles?.name ?? 'Unknown', email: m.profiles?.email ?? '', avatar: m.profiles?.avatar, type: 'mentor' as const })),
        ...(trainersRes.data ?? []).map((tr: any) => ({ id: tr.id, name: tr.profiles?.name ?? 'Unknown', email: tr.profiles?.email ?? '', avatar: tr.profiles?.avatar, type: 'trainer' as const })),
      ];
      setPendingItems(combined);

      setRecentRequests((reqsRes.data ?? []).map((r: any) => ({
        id: r.id, subject: r.subject, status: r.status,
        created_at: new Date(r.created_at).toLocaleDateString(),
        seeker_name: r.seeker?.name ?? 'Unknown',
        mentor_name: r.mentor?.name ?? 'Unknown',
      })));
    } catch {
      toast.error('Failed to load dashboard data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const totalPending = (stats?.pending_mentors ?? 0) + (stats?.pending_trainers ?? 0) + (stats?.pending_courses ?? 0);

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader title="Admin Dashboard" subtitle="Platform overview and management." />

      <div className="p-6 space-y-6">

        <div className={cn('flex justify-end', isRTL ? 'justify-start' : '')}>
          <Button variant="outline" size="sm" onClick={() => fetchData(true)} loading={refreshing}>
            <RefreshCw size={14} /> Refresh
          </Button>
        </div>

        {/* Pending alert */}
        {!loading && totalPending > 0 && (
          <div className={cn('flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl', isRTL ? 'flex-row-reverse' : '')}>
            <AlertCircle size={18} className="text-amber-600 flex-shrink-0" />
            <div className="flex-1">
              <span className="font-medium text-amber-800">{totalPending} items need your review </span>
              <span className="text-amber-700 text-sm">({stats?.pending_mentors} mentors, {stats?.pending_trainers} trainers, {stats?.pending_courses} courses)</span>
            </div>
            <Link href="/dashboard/admin/approvals">
              <button className="text-sm font-semibold text-amber-800 hover:text-amber-900">Review →</button>
            </Link>
          </div>
        )}

        {/* Stats */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard title={t('totalUsers')} value={(stats?.total_users ?? 0).toLocaleString()} icon={<Users size={20} />} color="blue" />
              <StatCard title="Job Seekers" value={(stats?.job_seekers ?? 0).toLocaleString()} icon={<TrendingUp size={20} />} color="green" />
              <StatCard title="Mentors" value={(stats?.mentors ?? 0).toLocaleString()} icon={<UserCheck size={20} />} color="amber" />
              <StatCard title="Trainers" value={(stats?.trainers ?? 0).toLocaleString()} icon={<Shield size={20} />} color="purple" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard title="Total Courses" value={String(stats?.total_courses ?? 0)} icon={<BookOpen size={20} />} color="teal" />
              <StatCard title="Total Requests" value={(stats?.total_requests ?? 0).toLocaleString()} icon={<MessageSquare size={20} />} color="blue" />
              <StatCard title="Pending Requests" value={String(stats?.pending_requests ?? 0)} icon={<AlertCircle size={20} />} color="red" />
              <StatCard title="Pending Approvals" value={String(totalPending)} icon={<UserCheck size={20} />} color="amber" />
            </div>
          </>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading ? <CardSkeleton /> : (
            <Card>
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
                <Link href="/dashboard/admin/approvals" className="text-sm text-primary-600">{t('viewAll')}</Link>
              </CardHeader>
              {pendingItems.length === 0
                ? <p className="text-sm text-gray-400 py-4 text-center">✓ No pending approvals</p>
                : <div className="space-y-3">
                    {pendingItems.map(item => (
                      <div key={item.id} className={cn('flex items-center gap-3 p-3 bg-gray-50 rounded-xl', isRTL ? 'flex-row-reverse' : '')}>
                        <Avatar name={item.name} src={item.avatar} size="sm" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                          <p className="text-xs text-gray-500 capitalize">{item.type} application</p>
                        </div>
                        <StatusBadge status="pending" />
                      </div>
                    ))}
                  </div>
              }
            </Card>
          )}

          {loading ? <CardSkeleton /> : (
            <Card>
              <CardHeader>
                <CardTitle>Recent Requests</CardTitle>
                <Link href="/dashboard/admin/requests" className="text-sm text-primary-600">{t('viewAll')}</Link>
              </CardHeader>
              {recentRequests.length === 0
                ? <p className="text-sm text-gray-400 py-4 text-center">No consultation requests yet</p>
                : <div className="space-y-3">
                    {recentRequests.map(req => (
                      <div key={req.id} className={cn('p-3 bg-gray-50 rounded-xl', isRTL ? 'text-right' : '')}>
                        <div className={cn('flex items-center justify-between mb-1', isRTL ? 'flex-row-reverse' : '')}>
                          <span className="text-sm font-medium text-gray-900 truncate">{req.seeker_name}</span>
                          <StatusBadge status={req.status as any} />
                        </div>
                        <p className="text-xs text-gray-600">→ {req.mentor_name}: {req.subject}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{req.created_at}</p>
                      </div>
                    ))}
                  </div>
              }
            </Card>
          )}
        </div>

        {/* Role breakdown */}
        {!loading && stats && (
          <Card>
            <CardHeader><CardTitle>{t('platformStats')}</CardTitle></CardHeader>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: 'Job Seekers', value: stats.job_seekers, color: 'bg-primary-500' },
                { label: 'Mentors', value: stats.mentors, color: 'bg-orange-500' },
                { label: 'Trainers', value: stats.trainers, color: 'bg-purple-500' },
              ].map(stat => {
                const pct = stats.total_users > 0 ? Math.round((stat.value / stats.total_users) * 100) : 0;
                return (
                  <div key={stat.label}>
                    <div className={cn('flex justify-between text-sm mb-2', isRTL ? 'flex-row-reverse' : '')}>
                      <span className="font-medium text-gray-700">{stat.label}</span>
                      <span className="text-gray-500">{pct}%</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full">
                      <div className={cn('h-3 rounded-full transition-all duration-700', stat.color)} style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{stat.value.toLocaleString()} users</p>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
