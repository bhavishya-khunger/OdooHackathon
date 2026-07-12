'use client';

import { Search, Bell, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function TopNav() {
  return (
    <header className="h-16 bg-white/80 dark:bg-[#030D1A]/80 backdrop-blur-2xl border-b border-slate-200 dark:border-cyan-900/30 flex items-center justify-between px-6 sticky top-0 z-10 shadow-[0_1px_8px_rgb(0,0,0,0.04)] dark:shadow-[0_1px_16px_rgba(0,0,0,0.4)] transition-colors duration-300">
      {/* Top accent line — dark only */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent pointer-events-none hidden dark:block" />

      {/* Search */}
      <div className="flex-1 flex items-center gap-4">
        <div className="relative w-full max-w-sm hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-cyan-500/50" />
          <input
            type="text"
            placeholder="Search assets, tags, people..."
            className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-[#051324]/80 border border-slate-200 dark:border-cyan-900/40 rounded-full text-sm text-slate-700 dark:text-cyan-100/80 placeholder:text-slate-400 dark:placeholder:text-cyan-100/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all"
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <button className="p-2 text-slate-400 dark:text-cyan-100/40 hover:text-slate-700 dark:hover:text-cyan-300 hover:bg-slate-100 dark:hover:bg-cyan-900/30 rounded-full transition-colors">
          <HelpCircle className="h-5 w-5" />
        </button>
        <button className="relative p-2 text-slate-400 dark:text-cyan-100/40 hover:text-slate-700 dark:hover:text-cyan-300 hover:bg-slate-100 dark:hover:bg-cyan-900/30 rounded-full transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-500 rounded-full ring-2 ring-white dark:ring-[#030D1A] shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
        </button>

        {/* Theme toggle */}
        <ThemeToggle />

        <div className="h-6 w-px bg-slate-200 dark:bg-cyan-900/50 mx-1" />
        <Link
          href="/login"
          className="flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-cyan-900/20 p-1.5 rounded-xl transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center text-[#010810] text-xs font-black shadow-[0_0_10px_rgba(6,182,212,0.3)] ring-2 ring-slate-200 dark:ring-cyan-900/50 group-hover:ring-cyan-500/30 transition-all">
            JD
          </div>
        </Link>
      </div>
    </header>
  );
}
