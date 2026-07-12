'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowRight, Building2 } from 'lucide-react';
import Link from 'next/link';
import { apiFetch, ApiError } from '@/lib/api';
import { useAuth } from '@/components/providers/AuthProvider';

type Mode = 'login' | 'register' | 'forgot';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { refreshUser } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'forgot') {
      if (!email.trim()) {
        setError('Please enter your email address.');
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setMode('login');
        setEmail('');
      }, 800);
      return;
    }

    if (!email.trim() || !password.trim() || (mode === 'register' && !name.trim())) {
      setError('Please fill in all required fields.');
      return;
    }

    // Domain validation
    if (!email.toLowerCase().endsWith('@odoo.com')) {
      setError('Access restricted: Only corporate @odoo.com email addresses are permitted.');
      return;
    }

    setIsLoading(true);

    const performAuth = async () => {
      try {
        if (mode === 'register') {
          await apiFetch('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
          });
        }
        
        // After register (or if login), we login to get the cookie
        await apiFetch('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });

        await refreshUser(); // This will trigger the redirect in AuthProvider
      } catch (err: any) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
        setIsLoading(false);
      }
    };

    performAuth();
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden flex w-full bg-background transition-colors duration-300">

      {/* Left Column - Form */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 sm:px-16 lg:px-24 relative">

        {/* Logo */}
        <div className="absolute top-8 left-8 sm:left-16 lg:left-24 flex items-center gap-2">
          <img src="/logo.png" alt="AssetFlow Logo" className="w-7 h-7 object-contain" />
          <span className="font-bold text-[19px] tracking-tight text-foreground">AssetFlow.</span>
        </div>

        <div className="w-full max-w-[380px] animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-[40px] font-semibold text-foreground tracking-tight mb-3 leading-tight">
            {mode === 'login' && 'Welcome back.'}
            {mode === 'register' && 'Create account.'}
            {mode === 'forgot' && 'Reset password.'}
          </h1>
          <p className="text-muted text-[15px] mb-10">
            {mode === 'login' && 'Sign in to keep managing your assets.'}
            {mode === 'register' && 'Join your workspace to get started.'}
            {mode === 'forgot' && 'Enter your email to receive a reset link.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'register' && (
              <div>
                <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-border/80 rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all bg-surface-hover/30 text-foreground"
                  placeholder="John Doe"
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-2">
                Corporate Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                className="w-full border border-border/80 rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all bg-surface-hover/30 text-foreground"
                placeholder="you@odoo.com"
              />
            </div>

            {mode !== 'forgot' && (
              <div>
                <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-border/80 rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all bg-surface-hover/30 text-foreground"
                  placeholder="At least 6 characters"
                />
              </div>
            )}

            {error && (
              <div className="rounded-lg bg-rose-500/10 p-3 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-rose-500 mt-0.5 shrink-0" />
                <p className="text-[13px] text-rose-600 dark:text-rose-400 font-medium leading-tight">
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 bg-foreground hover:bg-foreground/90 text-background rounded-lg text-[15px] font-medium transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin"></span>
              ) : (
                <>
                  {mode === 'login' && 'Sign in'}
                  {mode === 'register' && 'Create account'}
                  {mode === 'forgot' && 'Send reset link'}
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-[14px]">
            {mode === 'login' ? (
              <div className="flex flex-col gap-3">
                <p className="text-muted">
                  New to AssetFlow?{' '}
                  <button onClick={() => { setMode('register'); setError(''); }} className="font-semibold text-foreground hover:text-primary transition-colors">
                    Create one
                  </button>
                </p>
                <p className="text-muted">
                  Forgot your password?{' '}
                  <button onClick={() => { setMode('forgot'); setError(''); }} className="font-semibold text-foreground hover:text-primary transition-colors">
                    Reset it
                  </button>
                </p>
              </div>
            ) : (
              <p className="text-muted">
                Already have an account?{' '}
                <button onClick={() => { setMode('login'); setError(''); }} className="font-semibold text-foreground hover:text-primary transition-colors">
                  Sign in
                </button>
              </p>
            )}
          </div>

          <div className="absolute bottom-8 text-[12px] text-muted font-medium">
            Roles are assigned by the admin of your organisation.
          </div>
        </div>
      </div>

      {/* Right Column - Image */}
      <div className="hidden lg:block lg:w-[55%] p-4 pl-0">
        <div className="w-full h-full relative rounded-[2rem] overflow-hidden shadow-xl bg-surface-hover">
          {/* We use Next.js standard img tag here since it's a simple local image */}
          <img
            src="/login-illustration.png"
            alt="Workspace Illustration"
            className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-1000"
          />
          {/* Subtle gradient overlay to make it blend slightly */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
        </div>
      </div>

    </div>
  );
}
