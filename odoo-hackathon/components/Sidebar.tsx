'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Settings, 
  Box, 
  ArrowRightLeft, 
  Calendar, 
  Wrench, 
  ClipboardCheck, 
  BarChart3, 
  Bell,
  ChevronDown
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
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20">
      <div className="h-16 flex items-center px-6 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors group">
        <div className="flex items-center gap-3 w-full">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <span className="text-white text-sm font-bold">AF</span>
          </div>
          <span className="text-[15px] font-semibold text-[#172B4D] flex-1">AssetFlow</span>
          <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </div>
      </div>
      
      <div className="px-4 py-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Main Menu</p>
        <nav className="flex-1 space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/');
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-50/80 text-blue-700 font-medium' 
                    : 'text-[#42526E] hover:bg-gray-100 hover:text-[#172B4D]'
                }`}
              >
                <item.icon className={`h-4 w-4 ${isActive ? 'text-blue-700' : 'text-[#6B778C]'}`} />
                <span className="text-[14px]">{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-1 h-5 bg-blue-600 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
