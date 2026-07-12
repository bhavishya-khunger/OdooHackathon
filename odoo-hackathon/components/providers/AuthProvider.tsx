'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { apiFetch } from '@/lib/api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  department_id: number | null;
  status: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const refreshUser = async () => {
    try {
      const data = await apiFetch<User>('/auth/me', { method: 'GET' });
      setUser(data);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      setUser(null);
      router.push('/login');
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  // Client-side route protection
  useEffect(() => {
    if (isLoading) return; // Wait for initial fetch

    const isAuthRoute = pathname === '/login' || pathname === '/register';

    if (!user && !isAuthRoute) {
      // Unauthenticated user trying to access protected route
      router.push('/login');
    } else if (user && isAuthRoute) {
      // Authenticated user trying to access login/register
      router.push('/');
    }
  }, [user, isLoading, pathname, router]);

  return (
    <AuthContext.Provider value={{ user, isLoading, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
