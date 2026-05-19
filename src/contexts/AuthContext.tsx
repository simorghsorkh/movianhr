'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { UserRole } from '@/lib/types';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  headline?: string;
  phone?: string;
  location?: string;
  bio?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role?: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<AuthUser>) => Promise<void>;
  setRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (data) {
      setUser({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role as UserRole,
        avatar: data.avatar ?? undefined,
        headline: data.headline ?? undefined,
        phone: (data as any).phone ?? undefined,
        location: (data as any).location ?? undefined,
        bio: (data as any).bio ?? undefined,
      });
    } else {
      setUser(null);
    }
  }, [supabase]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) fetchProfile(session.user.id);
      else setUser(null);
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile, supabase]);

  const login = async (email: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return !error;
  };

  const register = async (name: string, email: string, password: string, role: UserRole = 'job-seeker'): Promise<boolean> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, role } },
    });
    return !error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateUser = async (data: Partial<AuthUser>) => {
    if (!user) return;
    const { error } = await (supabase.from('profiles') as any)
      .update({ name: data.name, avatar: data.avatar, headline: data.headline, phone: data.phone, location: data.location, bio: data.bio })
      .eq('id', user.id);
    if (!error) setUser(prev => prev ? { ...prev, ...data } : null);
  };

  const setRole = async (role: UserRole) => {
    if (!user) return;
    const { error } = await (supabase.from('profiles') as any).update({ role }).eq('id', user.id);
    if (!error) setUser(prev => prev ? { ...prev, role } : null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser, setRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside <AuthProvider>');
  return ctx;
}
