'use client';

import React, { useState } from 'react';
import {
  User, Lock, Bell, Globe, Shield, Trash2, Save,
  Eye, EyeOff, CheckCircle,
} from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';

type SettingsTab = 'account' | 'security' | 'notifications' | 'language' | 'privacy';

const TABS: { key: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { key: 'account',       label: 'Account',       icon: <User size={16} /> },
  { key: 'security',      label: 'Security',       icon: <Lock size={16} /> },
  { key: 'notifications', label: 'Notifications',  icon: <Bell size={16} /> },
  { key: 'language',      label: 'Language & Region', icon: <Globe size={16} /> },
  { key: 'privacy',       label: 'Privacy',        icon: <Shield size={16} /> },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none',
        checked ? 'bg-primary-600' : 'bg-gray-200'
      )}
      role="switch"
      aria-checked={checked}
    >
      <span
        className={cn(
          'inline-block h-4 w-4 rounded-full bg-white shadow transition-transform',
          checked ? 'translate-x-6' : 'translate-x-1'
        )}
      />
    </button>
  );
}

export default function SettingsPage() {
  const { t, lang, setLang, isRTL } = useLang();
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const [tab, setTab] = useState<SettingsTab>('account');

  /* Account form */
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [headline, setHeadline] = useState((user as any)?.headline ?? '');

  /* Security form */
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  /* Notification prefs */
  const [notifPrefs, setNotifPrefs] = useState({
    emailRequests: true,
    emailSessions: true,
    emailCourses: false,
    emailMarketing: false,
    pushRequests: true,
    pushSessions: true,
  });

  const saveAccount = () => {
    if (!name.trim()) { toast.error('Name cannot be empty.'); return; }
    updateUser({ name, email });
    toast.success('Account information updated successfully!');
  };

  const savePassword = () => {
    if (!currentPass) { toast.error('Please enter your current password.'); return; }
    if (newPass.length < 6) { toast.error('New password must be at least 6 characters.'); return; }
    if (newPass !== confirmPass) { toast.error('New passwords do not match.'); return; }
    setCurrentPass(''); setNewPass(''); setConfirmPass('');
    toast.success('Password changed successfully!');
  };

  const saveNotifications = () => {
    toast.success('Notification preferences saved!');
  };

  const setNotif = (key: keyof typeof notifPrefs, val: boolean) =>
    setNotifPrefs(p => ({ ...p, [key]: val }));

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader title="Settings" subtitle="Manage your account, security, and preferences." />

      <div className="p-6 max-w-4xl mx-auto">
        <div className={cn('flex flex-col md:flex-row gap-6', isRTL ? 'md:flex-row-reverse' : '')}>

          {/* Sidebar tabs */}
          <aside className="md:w-52 flex-shrink-0">
            <nav className="space-y-1">
              {TABS.map(t => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
                    isRTL ? 'flex-row-reverse text-right' : 'text-left',
                    tab === t.key
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  )}
                >
                  <span className={tab === t.key ? 'text-primary-600' : 'text-gray-400'}>{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1 space-y-6 min-w-0">

            {/* ── Account ── */}
            {tab === 'account' && (
              <Card>
                <CardHeader><CardTitle>Account Information</CardTitle></CardHeader>

                {/* Avatar */}
                <div className={cn('flex items-center gap-4 mb-6 pb-6 border-b border-gray-100', isRTL ? 'flex-row-reverse' : '')}>
                  <Avatar src={user?.avatar} name={user?.name} size="xl" />
                  <div>
                    <p className="font-medium text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-500 capitalize">{user?.role?.replace('-', ' ')}</p>
                    <button className="text-sm text-primary-600 hover:text-primary-700 mt-1 font-medium">
                      Change photo
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} />
                  <Input label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                  <Input label="Professional Headline" value={headline} onChange={e => setHeadline(e.target.value)} placeholder="e.g. Senior Frontend Developer" />
                </div>

                <div className="mt-6 flex justify-end">
                  <Button onClick={saveAccount}><Save size={15} /> Save Changes</Button>
                </div>
              </Card>
            )}

            {/* ── Security ── */}
            {tab === 'security' && (
              <>
                <Card>
                  <CardHeader><CardTitle>Change Password</CardTitle></CardHeader>
                  <div className="space-y-4">
                    <div className="relative">
                      <Input
                        label="Current Password"
                        type={showPwd ? 'text' : 'password'}
                        value={currentPass}
                        onChange={e => setCurrentPass(e.target.value)}
                        placeholder="••••••••"
                      />
                      <button type="button" onClick={() => setShowPwd(v => !v)} className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600">
                        {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <Input label="New Password" type={showPwd ? 'text' : 'password'} value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="Min. 6 characters" />
                    <Input label="Confirm New Password" type={showPwd ? 'text' : 'password'} value={confirmPass} onChange={e => setConfirmPass(e.target.value)} placeholder="Re-enter new password" />
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button onClick={savePassword}><Lock size={15} /> Update Password</Button>
                  </div>
                </Card>

                <Card>
                  <CardHeader><CardTitle>Active Sessions</CardTitle></CardHeader>
                  <div className="space-y-3">
                    {[
                      { device: 'Chrome on Windows', location: 'Tehran, Iran', current: true, time: 'Now' },
                      { device: 'Firefox on Android', location: 'Tehran, Iran', current: false, time: '2 days ago' },
                    ].map((s, i) => (
                      <div key={i} className={cn('flex items-center justify-between p-3 bg-gray-50 rounded-xl', isRTL ? 'flex-row-reverse' : '')}>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{s.device}</p>
                          <p className="text-xs text-gray-500">{s.location} · {s.time}</p>
                        </div>
                        {s.current
                          ? <span className="text-xs text-green-600 font-medium flex items-center gap-1"><CheckCircle size={12} /> Current</span>
                          : <button className="text-xs text-red-600 hover:text-red-700 font-medium">Revoke</button>
                        }
                      </div>
                    ))}
                  </div>
                </Card>
              </>
            )}

            {/* ── Notifications ── */}
            {tab === 'notifications' && (
              <Card>
                <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
                <div className="space-y-6">
                  {/* Email */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Email Notifications</h4>
                    <div className="space-y-4">
                      {([
                        { key: 'emailRequests', label: 'Consultation requests', desc: 'When someone sends you a request' },
                        { key: 'emailSessions', label: 'Session reminders', desc: '24 hours before a scheduled session' },
                        { key: 'emailCourses', label: 'Course updates', desc: 'When a course you enrolled in is updated' },
                        { key: 'emailMarketing', label: 'Tips & promotions', desc: 'Career tips and platform news' },
                      ] as const).map(item => (
                        <div key={item.key} className={cn('flex items-center justify-between', isRTL ? 'flex-row-reverse' : '')}>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{item.label}</p>
                            <p className="text-xs text-gray-500">{item.desc}</p>
                          </div>
                          <Toggle checked={notifPrefs[item.key]} onChange={v => setNotif(item.key, v)} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Push */}
                  <div className="pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">In-App Notifications</h4>
                    <div className="space-y-4">
                      {([
                        { key: 'pushRequests', label: 'New requests', desc: 'Real-time alerts for consultation requests' },
                        { key: 'pushSessions', label: 'Session updates', desc: 'Accepted, rejected, or modified sessions' },
                      ] as const).map(item => (
                        <div key={item.key} className={cn('flex items-center justify-between', isRTL ? 'flex-row-reverse' : '')}>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{item.label}</p>
                            <p className="text-xs text-gray-500">{item.desc}</p>
                          </div>
                          <Toggle checked={notifPrefs[item.key]} onChange={v => setNotif(item.key, v)} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button onClick={saveNotifications}><Save size={15} /> Save Preferences</Button>
                </div>
              </Card>
            )}

            {/* ── Language ── */}
            {tab === 'language' && (
              <Card>
                <CardHeader><CardTitle>Language & Region</CardTitle></CardHeader>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">Display Language</p>
                    <div className="grid grid-cols-2 gap-3">
                      {([
                        { code: 'en', label: 'English', flag: '🇬🇧', dir: 'LTR' },
                        { code: 'fa', label: 'فارسی', flag: '🇮🇷', dir: 'RTL' },
                      ] as const).map(l => (
                        <button
                          key={l.code}
                          onClick={() => { setLang(l.code); toast.success(`Language changed to ${l.label}`); }}
                          className={cn(
                            'flex items-center gap-3 p-4 rounded-xl border-2 transition-all',
                            lang === l.code ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                          )}
                        >
                          <span className="text-2xl">{l.flag}</span>
                          <div className="text-left">
                            <p className="font-semibold text-gray-900">{l.label}</p>
                            <p className="text-xs text-gray-500">{l.dir}</p>
                          </div>
                          {lang === l.code && <CheckCircle size={16} className="ms-auto text-primary-600" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* ── Privacy ── */}
            {tab === 'privacy' && (
              <>
                <Card>
                  <CardHeader><CardTitle>Privacy Settings</CardTitle></CardHeader>
                  <div className="space-y-4">
                    {([
                      { label: 'Show profile to mentors', desc: 'Mentors can view your full profile when you send a request' },
                      { label: 'Appear in mentor search', desc: 'Mentors can find you when browsing job seekers' },
                      { label: 'Share progress with admin', desc: 'Allow platform admin to see your assessment scores' },
                    ]).map((item, i) => (
                      <div key={i} className={cn('flex items-center justify-between', isRTL ? 'flex-row-reverse' : '')}>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.label}</p>
                          <p className="text-xs text-gray-500">{item.desc}</p>
                        </div>
                        <Toggle checked={i !== 2} onChange={() => toast.info('Privacy setting updated.')} />
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="border-red-100">
                  <CardHeader><CardTitle className="text-red-600">Danger Zone</CardTitle></CardHeader>
                  <p className="text-sm text-gray-500 mb-4">
                    Deleting your account is permanent and cannot be undone. All your data, requests, and history will be removed.
                  </p>
                  <Button
                    variant="danger"
                    onClick={() => toast.error('Account deletion is disabled in demo mode.')}
                  >
                    <Trash2 size={15} /> Delete Account
                  </Button>
                </Card>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
