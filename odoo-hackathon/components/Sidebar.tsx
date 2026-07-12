'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Settings, Box, ArrowRightLeft,
  Calendar, Wrench, ClipboardCheck, BarChart3, Bell, Search, Sun
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Organization setup', href: '/organization', icon: Settings },
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
    <div className="w-64 bg-[#141414] border-r border-[#222] h-screen flex flex-col fixed left-0 top-0 z-20 text-[#a3a3a3] font-sans">
      {/* Logo */}
      <div className="h-20 flex items-center px-6">
        <div className="flex items-center gap-3">
          <div className="relative w-6 h-6 flex items-center justify-center">
            {/* Custom Dot Triangle Logo mimicking the image */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="4" r="2" fill="#3b82f6" />
              <circle cx="7" cy="13" r="2" fill="#6366f1" />
              <circle cx="17" cy="13" r="2" fill="#8b5cf6" />
              <circle cx="9.5" cy="8.5" r="1.5" fill="#3b82f6" />
              <circle cx="14.5" cy="8.5" r="1.5" fill="#6366f1" />
              <circle cx="12" cy="13" r="1.5" fill="#8b5cf6" />
              <circle cx="9.5" cy="17.5" r="1.5" fill="#6366f1" />
              <circle cx="14.5" cy="17.5" r="1.5" fill="#3b82f6" />
            </svg>
          </div>
          <span className="text-[17px] font-semibold text-[#f5f5f5] tracking-tight">AssetFlow</span>
        </div>
      </div>

      {/* Nav */}
      <div className="px-4 py-2 flex-1 overflow-y-auto">
        <p className="text-[10px] font-bold text-[#666] uppercase tracking-[0.1em] mb-4 px-2">
          MAIN MENU
        </p>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-[14px] text-[13.5px] font-medium transition-colors ${
                  isActive
                    ? 'bg-[#222] text-[#f5f5f5]'
                    : 'text-[#a3a3a3] hover:text-[#f5f5f5] hover:bg-[#222]/50'
                }`}
              >
                <item.icon className={`h-[18px] w-[18px] ${isActive ? 'text-[#f5f5f5]' : 'text-[#888]'}`} strokeWidth={isActive ? 2.5 : 2} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer controls */}
      <div className="px-4 pb-6 mt-auto">
        <div className="flex items-center justify-between px-2 mb-6">
          <Settings className="h-5 w-5 text-[#888] hover:text-[#f5f5f5] cursor-pointer transition-colors" />
          <Search className="h-5 w-5 text-[#888] hover:text-[#f5f5f5] cursor-pointer transition-colors" />
          <Sun className="h-5 w-5 text-[#888] hover:text-[#f5f5f5] cursor-pointer transition-colors" />
        </div>
        
        <div className="flex items-center gap-3 px-3 py-2 border border-[#333] rounded-[14px] cursor-pointer hover:bg-[#222]/50 transition-colors">
          <div className="w-6 h-6 rounded-full bg-pink-600 flex items-center justify-center text-white text-[10px] font-bold tracking-tighter">
            JD
          </div>
          <p className="text-[13px] font-medium text-[#f5f5f5] flex-1 truncate">johndoe@exam...</p>
          <div className="px-1.5 py-0.5 rounded text-[9px] font-bold text-[#888] border border-[#333]">
            PRO
          </div>
        </div>
      </div>
    </div>
  );
}
