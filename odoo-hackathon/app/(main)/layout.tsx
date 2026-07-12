'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { PanelRightOpen, PanelRightClose } from 'lucide-react';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background flex transition-colors duration-300">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={`${isCollapsed ? 'pl-[80px]' : 'pl-[260px]'} flex-1 flex flex-col min-h-screen transition-all duration-300 relative`}>
        <main className="flex-1 flex flex-col overflow-y-auto relative">
          {/* Header Row for Toggle Button */}
          <div className="px-3 pt-3 pb-2">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-xl bg-surface-hover text-muted text-foreground transition-all inline-flex items-center justify-center border border-border"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <PanelRightClose className="h-5 w-5" /> : <PanelRightOpen className="h-5 w-5" />}
            </button>
          </div>

          {/* Page Content */}
          <div className="flex-1 px-8 pb-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
