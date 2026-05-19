'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Check, X, BookOpen, Users, UserCheck, RefreshCw } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useToast } from '@/contexts/ToastContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge, Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

type ApprovalStatus = 'pending' | 'approved' | 'rejected';

interface MentorRow {
  id: string;
  approval_status: ApprovalStatus;
  expertise: string[];
  hourly_rate: number;
  rating: number;
  profiles: { name: string; email: string; avatar: string | null; bio: string | null; created_at: string } | null;
}

interface TrainerRow {
  id: string;
  approval_status: ApprovalStatus;
  specialization: string[];
  profiles: { name: string; email: string; avatar: string | null; bio: string | null } | null;
}

interface CourseRow {
  id: string;
  title: string;
  title_fa: string | null;
  status: string;
  approval_status: ApprovalStatus;
  level: string;
  price: number;
  duration: string | null;
  thumbnail: string | null;
  profiles: { name: string } | null;
}

export default function AdminApprovalsPage() {
  const { t, lang, isRTL } = useLang();
  const toast = useToast();
  const supabase = createClient();

  const [tab, setTab] = useState<'mentors' | 'trainers' | 'courses'>('mentors');
  const [mentors, setMentors] = useState<MentorRow[]>([]);
  const [trainers, setTrainers] = useState<TrainerRow[]>([]);
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [mRes, tRes, cRes] = await Promise.all([
      supabase.from('mentor_profiles').select('*, profiles(name,email,avatar,bio,created_at)').order('id'),
      supabase.from('trainer_profiles').select('*, profiles(name,email,avatar,bio)').order('id'),
      supabase.from('courses').select('*, profiles:trainer_id(name)').order('created_at', { ascending: false }),
    ]);
    setMentors((mRes.data as unknown as MentorRow[]) ?? []);
    setTrainers((tRes.data as unknown as TrainerRow[]) ?? []);
    setCourses((cRes.data as unknown as CourseRow[]) ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const approveMentor = async (id: string, status: ApprovalStatus) => {
    setActionId(id);
    const { error } = await supabase.from('mentor_profiles').update({ approval_status: status }).eq('id', id);
    if (error) toast.error('Action failed.');
    else {
      const name = mentors.find(m => m.id === id)?.profiles?.name ?? 'Mentor';
      setMentors(prev => prev.map(m => m.id === id ? { ...m, approval_status: status } : m));
      status === 'approved' ? toast.success(`${name} approved as mentor.`) : toast.warning(`${name} rejected.`);
    }
    setActionId(null);
  };

  const approveTrainer = async (id: string, status: ApprovalStatus) => {
    setActionId(id);
    const { error } = await supabase.from('trainer_profiles').update({ approval_status: status }).eq('id', id);
    if (error) toast.error('Action failed.');
    else {
      const name = trainers.find(tr => tr.id === id)?.profiles?.name ?? 'Trainer';
      setTrainers(prev => prev.map(tr => tr.id === id ? { ...tr, approval_status: status } : tr));
      status === 'approved' ? toast.success(`${name} approved as trainer.`) : toast.warning(`${name} rejected.`);
    }
    setActionId(null);
  };

  const approveCourse = async (id: string, status: ApprovalStatus) => {
    setActionId(id);
    const { error } = await supabase.from('courses').update({ approval_status: status }).eq('id', id);
    if (error) toast.error('Action failed.');
    else {
      const title = courses.find(c => c.id === id)?.title ?? 'Course';
      setCourses(prev => prev.map(c => c.id === id ? { ...c, approval_status: status } : c));
      status === 'approved' ? toast.success(`"${title}" approved.`) : toast.warning(`"${title}" rejected.`);
    }
    setActionId(null);
  };

  const pendingMentors = mentors.filter(m => m.approval_status === 'pending').length;
  const pendingTrainers = trainers.filter(t => t.approval_status === 'pending').length;
  const pendingCourses = courses.filter(c => c.approval_status === 'pending').length;

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader title={t('approvals')} subtitle="Review and approve mentor, trainer, and course applications." />

      <div className="p-6 space-y-5">
        {/* Tabs */}
        <div className={cn('flex gap-2 flex-wrap', isRTL ? 'flex-row-reverse' : '')}>
          {[
            { key: 'mentors', label: `Mentors (${pendingMentors} pending)`, icon: <UserCheck size={14} /> },
            { key: 'trainers', label: `Trainers (${pendingTrainers} pending)`, icon: <Users size={14} /> },
            { key: 'courses', label: `Courses (${pendingCourses} pending)`, icon: <BookOpen size={14} /> },
          ].map(tb => (
            <button
              key={tb.key}
              onClick={() => setTab(tb.key as any)}
              className={cn('flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                tab === tb.key ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50')}
            >
              {tb.icon} {tb.label}
            </button>
          ))}
          <button onClick={() => fetchAll()} className="ms-auto p-2 rounded-lg text-gray-400 hover:bg-gray-100">
            <RefreshCw size={16} />
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}</div>
        ) : (
          <>
            {/* Mentor list */}
            {tab === 'mentors' && (
              <div className="space-y-4">
                {mentors.length === 0 && <p className="text-center py-12 text-gray-400">No mentor applications yet.</p>}
                {mentors.map(mentor => (
                  <Card key={mentor.id}>
                    <div className={cn('flex items-start gap-4', isRTL ? 'flex-row-reverse' : '')}>
                      <Avatar name={mentor.profiles?.name ?? '?'} src={mentor.profiles?.avatar ?? undefined} size="lg" />
                      <div className="flex-1">
                        <div className={cn('flex items-center justify-between', isRTL ? 'flex-row-reverse' : '')}>
                          <div>
                            <h3 className="font-semibold text-gray-900">{mentor.profiles?.name}</h3>
                            <p className="text-sm text-gray-500">{mentor.profiles?.email}</p>
                          </div>
                          <StatusBadge status={mentor.approval_status} />
                        </div>
                        {mentor.profiles?.bio && <p className="text-sm text-gray-600 mt-2">{mentor.profiles.bio}</p>}
                        <div className={cn('flex flex-wrap gap-1.5 mt-2', isRTL ? 'flex-row-reverse' : '')}>
                          {(mentor.expertise ?? []).map(e => <Badge key={e} variant="info">{e}</Badge>)}
                        </div>
                        <div className={cn('flex items-center gap-3 text-xs text-gray-500 mt-2', isRTL ? 'flex-row-reverse' : '')}>
                          <span>Rate: {mentor.hourly_rate?.toLocaleString()} تومان/hr</span>
                          {mentor.profiles?.created_at && <span>Applied: {new Date(mentor.profiles.created_at).toLocaleDateString()}</span>}
                        </div>
                        {mentor.approval_status === 'pending' && (
                          <div className={cn('flex gap-2 mt-3', isRTL ? 'flex-row-reverse' : '')}>
                            <Button size="sm" variant="primary" loading={actionId === mentor.id} onClick={() => approveMentor(mentor.id, 'approved')}>
                              <Check size={14} /> {t('approveMentor')}
                            </Button>
                            <Button size="sm" variant="danger" loading={actionId === mentor.id} onClick={() => approveMentor(mentor.id, 'rejected')}>
                              <X size={14} /> {t('reject')}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Trainer list */}
            {tab === 'trainers' && (
              <div className="space-y-4">
                {trainers.length === 0 && <p className="text-center py-12 text-gray-400">No trainer applications yet.</p>}
                {trainers.map(trainer => (
                  <Card key={trainer.id}>
                    <div className={cn('flex items-start gap-4', isRTL ? 'flex-row-reverse' : '')}>
                      <Avatar name={trainer.profiles?.name ?? '?'} src={trainer.profiles?.avatar ?? undefined} size="lg" />
                      <div className="flex-1">
                        <div className={cn('flex items-center justify-between', isRTL ? 'flex-row-reverse' : '')}>
                          <div>
                            <h3 className="font-semibold text-gray-900">{trainer.profiles?.name}</h3>
                            <p className="text-sm text-gray-500">{trainer.profiles?.email}</p>
                          </div>
                          <StatusBadge status={trainer.approval_status} />
                        </div>
                        {trainer.profiles?.bio && <p className="text-sm text-gray-600 mt-2">{trainer.profiles.bio}</p>}
                        <p className="text-sm text-gray-500 mt-1">Specialization: {(trainer.specialization ?? []).join(', ')}</p>
                        {trainer.approval_status === 'pending' && (
                          <div className={cn('flex gap-2 mt-3', isRTL ? 'flex-row-reverse' : '')}>
                            <Button size="sm" variant="primary" loading={actionId === trainer.id} onClick={() => approveTrainer(trainer.id, 'approved')}>
                              <Check size={14} /> {t('approveTrainer')}
                            </Button>
                            <Button size="sm" variant="danger" loading={actionId === trainer.id} onClick={() => approveTrainer(trainer.id, 'rejected')}>
                              <X size={14} /> {t('reject')}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Course list */}
            {tab === 'courses' && (
              <div className="space-y-4">
                {courses.length === 0 && <p className="text-center py-12 text-gray-400">No course submissions yet.</p>}
                {courses.map(course => (
                  <Card key={course.id}>
                    <div className={cn('flex items-start gap-4', isRTL ? 'flex-row-reverse' : '')}>
                      {course.thumbnail && (
                        <img src={course.thumbnail} alt="" className="w-24 h-16 object-cover rounded-xl flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <div className={cn('flex items-start justify-between gap-2', isRTL ? 'flex-row-reverse' : '')}>
                          <div>
                            <h3 className="font-semibold text-gray-900">{lang === 'fa' ? (course.title_fa ?? course.title) : course.title}</h3>
                            <p className="text-sm text-gray-500">by {course.profiles?.name}</p>
                          </div>
                          <div className={cn('flex gap-2', isRTL ? 'flex-row-reverse' : '')}>
                            <StatusBadge status={course.status as any} />
                            <StatusBadge status={course.approval_status} />
                          </div>
                        </div>
                        <div className={cn('flex gap-4 text-xs text-gray-500 mt-2', isRTL ? 'flex-row-reverse' : '')}>
                          <span className="capitalize">{course.level}</span>
                          {course.duration && <span>{course.duration}</span>}
                          <span>{course.price.toLocaleString()} تومان</span>
                        </div>
                        {course.approval_status === 'pending' && (
                          <div className={cn('flex gap-2 mt-3', isRTL ? 'flex-row-reverse' : '')}>
                            <Button size="sm" variant="primary" loading={actionId === course.id} onClick={() => approveCourse(course.id, 'approved')}>
                              <Check size={14} /> {t('approveCourse')}
                            </Button>
                            <Button size="sm" variant="danger" loading={actionId === course.id} onClick={() => approveCourse(course.id, 'rejected')}>
                              <X size={14} /> {t('reject')}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
