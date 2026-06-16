'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp, FileText, Map, Users, BookOpen,
  MessageSquare, ClipboardList, Lock, Linkedin,
} from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useFeatureAccess } from '@/contexts/FeatureAccessContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { FEATURES } from '@/lib/features';
import { getMyRequests, getMyEnrollments, getJobSeekerProfile } from '@/lib/supabase/dal';
import { cn, toPersianNum } from '@/lib/utils';

const ICON_MAP: Record<string, React.ReactNode> = {
  assessment:   <ClipboardList size={32} />,
  'cv-builder': <FileText size={32} />,
  linkedin:     <Linkedin size={32} />,
  roadmap:      <Map size={32} />,
  mentors:      <Users size={32} />,
  courses:      <BookOpen size={32} />,
};

export default function JobSeekerDashboardPage() {
  const { lang, isRTL } = useLang();
  const { user } = useAuth();
  const { hasAccess } = useFeatureAccess();
  const fa = lang === 'fa';

  const [loading, setLoading]         = useState(true);
  const [requests, setRequests]       = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [jsProfile, setJsProfile]     = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      getMyRequests(user.id),
      getMyEnrollments(user.id),
      getJobSeekerProfile(user.id),
    ])
      .then(([reqs, enrs, profile]) => {
        setRequests(reqs);
        setEnrollments(enrs);
        setJsProfile(profile);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const score = jsProfile?.employability_score ?? null;

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader
        title={fa ? `خوش آمدید، ${user?.name?.split(' ')[0] ?? ''}!` : `Welcome, ${user?.name?.split(' ')[0] ?? 'there'}!`}
        subtitle={fa ? 'ابزارهای شغلی خود را انتخاب کنید.' : 'Choose a career tool below.'}
      />

      <div className="p-6 space-y-6">

        {/* ── Quick stats ── */}
        <div className="grid grid-cols-3 gap-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)
          ) : (
            <>
              <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 text-center">
                <p className="text-xl font-bold text-blue-700">
                  {score ? (fa ? `${toPersianNum(score)}/۱۰۰` : `${score}/100`) : '—'}
                </p>
                <p className="text-xs text-blue-500 mt-0.5">{fa ? 'امتیاز استخدام' : 'Score'}</p>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 text-center">
                <p className="text-xl font-bold text-amber-700">
                  {fa ? toPersianNum(requests.length) : requests.length}
                </p>
                <p className="text-xs text-amber-500 mt-0.5">{fa ? 'درخواست‌ها' : 'Requests'}</p>
              </div>
              <div className="bg-purple-50 border border-purple-100 rounded-2xl px-4 py-3 text-center">
                <p className="text-xl font-bold text-purple-700">
                  {fa ? toPersianNum(enrollments.length) : enrollments.length}
                </p>
                <p className="text-xs text-purple-500 mt-0.5">{fa ? 'دوره‌ها' : 'Courses'}</p>
              </div>
            </>
          )}
        </div>

        {/* ── Feature grid ── */}
        <div>
          <h2 className={cn('text-sm font-semibold text-gray-400 mb-4', isRTL ? 'text-right' : '')}>
            {fa ? 'ابزارهای شما' : 'Your Tools'}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {FEATURES.map((feature) => {
              const accessible = user ? hasAccess(user.id, feature.key) : true;
              const label = fa ? feature.labelFa : feature.labelEn;
              const desc  = fa ? feature.descFa  : feature.descEn;

              const card = (
                <div
                  className={cn(
                    'relative flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-200 text-center',
                    feature.border,
                    accessible
                      ? 'bg-white hover:shadow-lg hover:-translate-y-1 cursor-pointer'
                      : 'bg-gray-50 border-gray-100 cursor-not-allowed opacity-50'
                  )}
                >
                  {!accessible && (
                    <div className="absolute top-3 end-3">
                      <Lock size={13} className="text-gray-400" />
                    </div>
                  )}

                  <div className={cn(
                    'w-16 h-16 rounded-2xl flex items-center justify-center',
                    accessible ? feature.color : 'bg-gray-100 text-gray-300'
                  )}>
                    {ICON_MAP[feature.key]}
                  </div>

                  <div>
                    <p className={cn('text-sm font-bold', accessible ? 'text-gray-900' : 'text-gray-400')}>
                      {label}
                    </p>
                    <p className={cn('text-xs mt-0.5 leading-relaxed', accessible ? 'text-gray-500' : 'text-gray-300')}>
                      {accessible ? desc : (fa ? 'دسترسی محدود' : 'Restricted')}
                    </p>
                  </div>
                </div>
              );

              return accessible ? (
                <Link key={feature.key} href={feature.href}>
                  {card}
                </Link>
              ) : (
                <div key={feature.key}>{card}</div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
