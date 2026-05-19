'use client';

import React, { createContext, useContext, useState } from 'react';

export interface AppNotification {
  id: string;
  type: 'request' | 'approval' | 'session' | 'course' | 'system';
  title: string;
  body: string;
  time: string;
  read: boolean;
  href?: string;
}

interface NotificationContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
  addNotification: (n: Omit<AppNotification, 'id' | 'read' | 'time'>) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

const DEMO_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    type: 'request',
    title: 'New consultation request',
    body: 'Sara Ahmadi sent you a consultation request about career transition.',
    time: '2 min ago',
    read: false,
    href: '/dashboard/mentor/requests',
  },
  {
    id: 'n2',
    type: 'approval',
    title: 'Your course was approved',
    body: '"Advanced React Patterns" has been approved by admin and is now live.',
    time: '1 hour ago',
    read: false,
    href: '/dashboard/trainer/courses',
  },
  {
    id: 'n3',
    type: 'session',
    title: 'Session reminder',
    body: 'You have a session with Ali Rezaei tomorrow at 14:00.',
    time: '3 hours ago',
    read: false,
    href: '/dashboard/mentor/sessions',
  },
  {
    id: 'n4',
    type: 'course',
    title: 'New enrollment',
    body: '5 new students enrolled in "UI/UX Design Fundamentals" today.',
    time: 'Yesterday',
    read: true,
    href: '/dashboard/trainer/students',
  },
  {
    id: 'n5',
    type: 'system',
    title: 'Profile completion',
    body: 'Complete your profile to get 3x more consultation requests.',
    time: '2 days ago',
    read: true,
    href: '/dashboard/job-seeker/profile',
  },
];

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(DEMO_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markRead = (id: string) =>
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const markAllRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  const addNotification = (n: Omit<AppNotification, 'id' | 'read' | 'time'>) =>
    setNotifications(prev => [
      { ...n, id: `n-${Date.now()}`, read: false, time: 'Just now' },
      ...prev,
    ]);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markRead, markAllRead, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be inside <NotificationProvider>');
  return ctx;
}
