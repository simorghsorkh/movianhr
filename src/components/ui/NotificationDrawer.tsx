'use client';

import React, { useEffect, useRef } from 'react';
import { X, Bell, CheckCheck, MessageSquare, ShieldCheck, Calendar, BookOpen, Settings } from 'lucide-react';
import { useNotifications, type AppNotification } from '@/contexts/NotificationContext';
import { cn } from '@/lib/utils';

const TYPE_ICON: Record<AppNotification['type'], React.ReactNode> = {
  request:  <MessageSquare size={16} />,
  approval: <ShieldCheck size={16} />,
  session:  <Calendar size={16} />,
  course:   <BookOpen size={16} />,
  system:   <Settings size={16} />,
};

const TYPE_COLOR: Record<AppNotification['type'], string> = {
  request:  'bg-blue-100 text-blue-600',
  approval: 'bg-green-100 text-green-600',
  session:  'bg-purple-100 text-purple-600',
  course:   'bg-orange-100 text-orange-600',
  system:   'bg-gray-100 text-gray-600',
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationDrawer({ isOpen, onClose }: Props) {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const drawerRef = useRef<HTMLDivElement>(null);

  /* Close on outside click */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onClose]);

  /* Close on Escape */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop (mobile) */}
      <div className="fixed inset-0 z-40 bg-black/20 md:bg-transparent" onClick={onClose} />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        className={cn(
          'fixed top-16 end-4 z-50 w-full max-w-sm',
          'bg-white rounded-2xl shadow-2xl border border-gray-100',
          'animate-slideUp'
        )}
        role="dialog"
        aria-label="Notifications"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-gray-700" />
            <h2 className="font-semibold text-gray-900">Notifications</h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium px-2 py-1 rounded-lg hover:bg-primary-50 transition-colors"
              >
                <CheckCheck size={13} /> Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="max-h-[420px] overflow-y-auto divide-y divide-gray-50">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <Bell size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => markRead(n.id)}
                className={cn(
                  'w-full flex items-start gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors',
                  !n.read && 'bg-primary-50/40'
                )}
              >
                {/* Icon badge */}
                <div className={cn('mt-0.5 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center', TYPE_COLOR[n.type])}>
                  {TYPE_ICON[n.type]}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm leading-snug', !n.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700')}>
                    {n.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">{n.body}</p>
                  <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                </div>

                {/* Unread dot */}
                {!n.read && (
                  <div className="mt-1.5 flex-shrink-0 w-2 h-2 bg-primary-500 rounded-full" />
                )}
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 text-center">
          <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">
            View all notifications
          </button>
        </div>
      </div>
    </>
  );
}
