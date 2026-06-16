'use client';

import React from 'react';
import Link from 'next/link';
import { Route, Package, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { cn } from '@/lib/utils';

export default function JobSeekerDashboardPage() {
  const { lang, isRTL } = useLang();
  const { user } = useAuth();
  const fa = lang === 'fa';
  const nl = lang === 'nl';

  const ChevronEnd = isRTL ? ChevronLeft : ChevronRight;

  const cards = [
    {
      href:    '/dashboard/job-seeker/journey',
      icon:    <Route size={36} />,
      bg:      'bg-blue-50',
      iconBg:  'bg-blue-100 text-blue-600',
      border:  'border-blue-100 hover:border-blue-300',
      title:   fa ? 'مسیر من'    : nl ? 'Mijn traject'   : 'My Journey',
      desc:    fa ? 'اپلای‌ها، مصاحبه‌ها و تقویم جلسات'
                  : nl ? 'Sollicitaties, interviews en agenda'
                  : 'Applications, interviews & scheduled sessions',
    },
    {
      href:    '/dashboard/job-seeker/services',
      icon:    <Package size={36} />,
      bg:      'bg-emerald-50',
      iconBg:  'bg-emerald-100 text-emerald-600',
      border:  'border-emerald-100 hover:border-emerald-300',
      title:   fa ? 'خدمات من'   : nl ? 'Mijn diensten'  : 'My Services',
      desc:    fa ? 'خدمات فعال در پکیج شما'
                  : nl ? 'Actieve diensten in uw pakket'
                  : 'Active features included in your plan',
    },
    {
      href:    '/dashboard/job-seeker/profile',
      icon:    <User size={36} />,
      bg:      'bg-violet-50',
      iconBg:  'bg-violet-100 text-violet-600',
      border:  'border-violet-100 hover:border-violet-300',
      title:   fa ? 'پروفایل من' : nl ? 'Mijn profiel'   : 'My Profile',
      desc:    fa ? 'اطلاعات شخصی و تکمیل پروفایل'
                  : nl ? 'Persoonlijke informatie en profielstatus'
                  : 'Personal information & profile completion',
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader
        title={
          fa ? `خوش آمدید، ${user?.name?.split(' ')[0] ?? ''}!`
             : `Welcome, ${user?.name?.split(' ')[0] ?? 'there'}!`
        }
        subtitle={
          fa ? 'یکی از گزینه‌های زیر را انتخاب کنید.'
             : nl ? 'Kies een van de opties hieronder.'
             : 'Choose one of the options below.'
        }
      />

      <div className="p-6 flex flex-col gap-4 max-w-xl mx-auto mt-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className={cn(
              'flex items-center gap-5 rounded-2xl border-2 px-6 py-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5',
              card.bg, card.border,
              isRTL ? 'flex-row-reverse' : ''
            )}
          >
            {/* Icon */}
            <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0', card.iconBg)}>
              {card.icon}
            </div>

            {/* Text */}
            <div className={cn('flex-1 min-w-0', isRTL ? 'text-right' : '')}>
              <p className="text-lg font-bold text-gray-900 mb-1">{card.title}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{card.desc}</p>
            </div>

            {/* Arrow */}
            <ChevronEnd size={22} className="flex-shrink-0 text-gray-300" />
          </Link>
        ))}
      </div>
    </div>
  );
}
