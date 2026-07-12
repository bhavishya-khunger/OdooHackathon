'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
    LayoutDashboard, Settings, Box, ArrowRightLeft,
    Calendar, Wrench, ClipboardCheck, BarChart3, Bell, Search, PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Organization setup', href: '/organization', icon: Settings },
    { name: 'Assets', href: '/assets', icon: Box },
    { name: 'Allocation & Transfer', href: '/allocation', icon: ArrowRightLeft },
    { name: 'Resource Booking', href: '/booking', icon: Calendar },
    { name: 'Maintenance', href: '/maintenance', icon: Wrench },
    { name: 'Audit', href: '/audit', icon: ClipboardCheck },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
];

export default function Sidebar({ isCollapsed, setIsCollapsed }: { isCollapsed: boolean, setIsCollapsed: (val: boolean) => void }) {
    const pathname = usePathname();
    const [showNotifs, setShowNotifs] = useState(false);

    return (
        <div className={`${isCollapsed ? 'w-[80px]' : 'w-[260px]'} bg-sidebar-bg h-screen flex flex-col fixed left-0 top-0 z-20 transition-all duration-300 border-r border-border/50`}>
            {/* Header */}
            <div className={`h-16 flex items-center px-6 cursor-pointer group mb-2 mt-2 ${isCollapsed ? 'justify-center' : ''}`}>
                {!isCollapsed ? (
                    <div className="flex items-center gap-3 w-full overflow-hidden">
                        <img src="/logo.png" alt="AssetFlow Logo" className="w-7 h-7 object-contain shrink-0" />
                        <span className="text-[18px] font-medium text-foreground tracking-tight flex-1 whitespace-nowrap">AssetFlow</span>
                    </div>
                ) : (
                    <img src="/logo.png" alt="AssetFlow Logo" className="w-7 h-7 object-contain shrink-0" />
                )}
            </div>

            {/* Navigation */}
            <div className="px-3 overflow-y-auto flex-1 space-y-6 scrollbar-hide relative">
                <div>
                    {!isCollapsed && <p className="text-[11px] font-semibold text-faint uppercase tracking-wider mb-2 px-4 truncate">Main Menu</p>}
                    <nav className={`space-y-0.5 ${isCollapsed ? 'mt-4' : ''}`}>
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/');

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    title={isCollapsed ? item.name : undefined}
                                    className={`flex items-center gap-3 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${isActive
                                            ? 'bg-surface-hover text-foreground'
                                            : 'text-muted hover:bg-surface-hover/50 hover:text-foreground'
                                        } ${isCollapsed ? 'justify-center px-0 w-10 h-10 mx-auto' : 'px-4'}`}
                                >
                                    <item.icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-foreground' : 'text-muted'}`} strokeWidth={isActive ? 2.5 : 2} />
                                    {!isCollapsed && <span className="text-[14px] truncate">{item.name}</span>}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Footer Area */}
            <div className="px-3 pb-4 pt-2 mt-auto flex flex-col gap-3 items-center relative">
                {/* Notification Popover */}
                {showNotifs && (
                    <div className={`absolute bottom-full left-4 mb-2 bg-surface border border-border shadow-xl rounded-2xl w-80 overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2 ${isCollapsed ? 'ml-12' : 'ml-0'}`}>
                        <div className="p-4 border-b border-border flex justify-between items-center bg-surface-hover/50">
                            <h3 className="font-semibold text-foreground text-sm">Recent Notifications</h3>
                            <Link href="/notifications" onClick={() => setShowNotifs(false)} className="text-xs text-primary hover:text-primary-hover font-medium px-2 py-1 bg-primary/10 rounded-md">View all</Link>
                        </div>
                        <div className="flex flex-col max-h-80 overflow-y-auto">
                            <div className="p-3 border-b border-border hover:bg-surface-hover/30 transition-colors cursor-pointer flex gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                                <div>
                                    <div className="text-[13px] font-medium text-foreground mb-0.5">Laptop AF-0014 assigned</div>
                                    <div className="text-[11px] text-muted">2m ago • Request #TR-992 approved</div>
                                </div>
                            </div>
                            <div className="p-3 border-b border-border hover:bg-surface-hover/30 transition-colors cursor-pointer flex gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                                <div>
                                    <div className="text-[13px] font-medium text-foreground mb-0.5">Maintenance approved</div>
                                    <div className="text-[11px] text-muted">18m ago • Projector AF-0055</div>
                                </div>
                            </div>
                            <div className="p-3 hover:bg-surface-hover/30 transition-colors cursor-pointer flex gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
                                <div>
                                    <div className="text-[13px] font-medium text-foreground mb-0.5">Overdue return: AF-0021</div>
                                    <div className="text-[11px] text-muted">1d ago • Due 09-Jul-2026</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Quick Action Icons */}
                <div className={`flex items-center ${isCollapsed ? 'flex-col gap-3' : 'gap-1.5 px-2 w-full'}`}>
                    <button 
                        onClick={() => setShowNotifs(!showNotifs)}
                        className={`p-2 rounded-full transition-colors border shrink-0 relative ${showNotifs ? 'bg-surface-hover text-foreground border-border' : 'text-muted hover:bg-surface-hover hover:text-foreground border-transparent hover:border-border'}`} 
                        title="Notifications"
                    >
                        <Bell className="h-4 w-4" />
                        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full ring-2 ring-sidebar-bg"></span>
                    </button>
                    
                    {!isCollapsed && (
                        <button className="p-2 text-muted hover:bg-surface-hover hover:text-foreground rounded-full transition-colors border border-transparent hover:border-border shrink-0" title="Search">
                            <Search className="h-4 w-4" />
                        </button>
                    )}
                    <div className={isCollapsed ? '' : 'ml-auto shrink-0'}>
                        <ThemeToggle />
                    </div>
                </div>

                {/* User Profile */}
                <button className={`flex items-center gap-3 py-2 rounded-full border border-border hover:bg-surface-hover transition-colors text-left ${isCollapsed ? 'px-2 justify-center border-transparent hover:border-border' : 'px-3 w-full'}`}>
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                        JD
                    </div>
                    {!isCollapsed && (
                        <>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-foreground truncate">johndoe@example.com</p>
                            </div>
                            <div className="text-[10px] font-medium text-muted bg-background border border-border px-1.5 py-0.5 rounded shrink-0">
                                PRO
                            </div>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
