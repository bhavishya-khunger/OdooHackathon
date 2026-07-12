'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Settings, Box, ArrowRightLeft,
  Calendar, Wrench, ClipboardCheck, BarChart3, Bell, ChevronDown,
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Organization', href: '/organization', icon: Settings },
  { name: 'Assets', href: '/assets', icon: Box },
  { name: 'Allocation & Transfer', href: '/allocation', icon: ArrowRightLeft },
  { name: 'Resource Booking', href: '/booking', icon: Calendar },
  { name: 'Maintenance', href: '/maintenance', icon: Wrench },
  { name: 'Audit', href: '/audit', icon: ClipboardCheck },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Notifications', href: '/notifications', icon: Bell },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white/90 dark:bg-[#030D1A]/90 backdrop-blur-2xl border-r border-slate-200 dark:border-cyan-900/30 h-screen flex flex-col fixed left-0 top-0 shadow-[4px_0_24px_rgba(0,0,0,0.06)] dark:shadow-[4px_0_32px_rgba(0,0,0,0.5)] z-20 transition-colors duration-300">
      {/* Dark-only accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent hidden dark:block" />

      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-slate-100 dark:border-cyan-900/30 cursor-pointer hover:bg-slate-50 dark:hover:bg-cyan-900/10 transition-colors group">
        <div className="flex items-center gap-3 w-full">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.4)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all">
            <span className="text-[#010810] font-black text-sm">A</span>
          </div>
          <span className="text-[15px] font-bold text-slate-900 dark:text-white tracking-tight flex-1">AssetFlow</span>
          <ChevronDown className="h-4 w-4 text-slate-400 dark:text-cyan-500/50 group-hover:text-slate-600 dark:group-hover:text-cyan-400 transition-colors" />
        </div>
      </div>

      {/* Nav */}
      <div className="px-3 py-4 flex-1 overflow-y-auto">
        <p className="text-[10px] font-mono font-semibold text-slate-400 dark:text-cyan-500/50 uppercase tracking-[0.2em] mb-3 px-3">
          Main Menu
        </p>
        <nav className="space-y-0.5">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (pathname.startsWith(item.href) && item.href !== '/');

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 font-semibold border border-cyan-200 dark:border-cyan-500/20'
                    : 'text-slate-500 dark:text-cyan-100/50 hover:bg-slate-100 dark:hover:bg-cyan-900/20 hover:text-slate-900 dark:hover:text-cyan-200 border border-transparent'
                }`}
              >
                {/* Active accent bar */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-cyan-500 rounded-full dark:shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
                )}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  isActive
                    ? 'bg-cyan-100 dark:bg-cyan-500/20'
                    : 'bg-transparent group-hover:bg-slate-200/60 dark:group-hover:bg-cyan-900/30'
                }`}>
                  <item.icon className={`h-4 w-4 ${
                    isActive
                      ? 'text-cyan-600 dark:text-cyan-400'
                      : 'text-slate-400 dark:text-cyan-100/40 group-hover:text-slate-600 dark:group-hover:text-cyan-300'
                  }`} />
                </div>
                <span className="flex-1 text-[13.5px]">{item.name}</span>
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 dark:shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer user area */}
      <div className="p-4 border-t border-slate-100 dark:border-cyan-900/30">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-cyan-900/20 transition-colors cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center text-[#010810] text-xs font-black shadow-[0_0_10px_rgba(6,182,212,0.3)] ring-2 ring-slate-200 dark:ring-cyan-900/50 group-hover:ring-cyan-500/30 transition-all">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-200 truncate">John Doe</p>
            <p className="text-xs text-slate-400 dark:text-cyan-400/60 font-mono truncate">Administrator</p>
          </div>
        </div>
      </div>

      {/* Dark-only bottom accent */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent hidden dark:block" />
    </div>
  );
}
