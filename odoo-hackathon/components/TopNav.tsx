'use client';

import { Search, Bell, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function TopNav() {
  return (
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-6 sticky top-0 z-10 transition-colors duration-200">
      <div className="flex-1 flex items-center gap-4">
        <div className="relative w-full max-w-md hidden md:block group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search assets, users, or tickets..."
            className="block w-full pl-10 pr-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface focus:border-transparent transition-all sm:text-sm"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <button className="text-muted hover:text-foreground p-2 rounded-full hover:bg-surface-hover transition-colors">
          <HelpCircle className="h-5 w-5" />
        </button>
        <button className="text-muted hover:text-foreground p-2 rounded-full hover:bg-surface-hover transition-colors relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-surface" />
        </button>
        <div className="h-8 w-px bg-border mx-2 hidden sm:block"></div>
        <Link href="/login" className="flex items-center gap-2 hover:bg-surface-hover p-1.5 rounded-lg transition-colors cursor-pointer group">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-surface transition-colors">
            <span className="text-sm font-semibold">JD</span>
          </div>
        </Link>
      </div>
    </header>
  );
}
