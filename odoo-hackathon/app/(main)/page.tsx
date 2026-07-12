import { Search, Plus, Grid3X3, Box } from 'lucide-react';

import React from 'react';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '@/components/ui/motionVariants';

import { StatsCardGrid } from '@/components/ui/StatsCardGrid';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { ActionButtonGroup } from '@/components/ui/ActionButtonGroup';
import { ActivityFeed } from '@/components/ui/ActivityFeed';
import { OverdueReturns } from '@/components/ui/OverdueReturns';

export default function Dashboard() {
  return (
    <div className="relative min-h-screen bg-bg-base text-text-primary p-6 md:p-10 font-sans transition-colors duration-300">
      <div
        className="max-w-[1400px] mx-auto flex flex-col gap-8 animate-in fade-in duration-500"
        
        
        
      >
        {/* Urgent Alerts Section */}
        <div  className="w-full">
          <AlertBanner />
        </div>

        {/* Header & Quick Actions */}
        <header
          
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border-base/50"
        >
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-text-primary">
              Dashboard
            </h1>
            <p className="text-sm text-text-secondary">
              Welcome back. Here's what's happening today.
            </p>
          </div>

          {/* Keeps buttons nicely aligned to the right/bottom on desktop */}
          <div className="shrink-0">
            <ActionButtonGroup />
          </div>
        </header>

        {/* Top level KPIs */}
        <section  className="w-full">
          <StatsCardGrid />
        </section>

        {/* Main Content Split - Note the 'items-start' to allow sticky positioning */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Left Column: Activity Feed (Main Data) */}
          <main  className="lg:col-span-2">
            <ActivityFeed />
          </main>

          {/* Right Column: Context & Secondary Info (Sticky for UX) */}
          <aside
            
            className="flex flex-col gap-6 sticky top-10"
          >
            <OverdueReturns />

            {/* Enhanced Placeholder: Added subtle UI elements to make it feel less "empty" */}
            <div className="bg-bg-surface border border-border-base rounded-3xl p-8 min-h-[280px] flex flex-col items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="w-12 h-12 mb-4 rounded-full bg-border-base flex items-center justify-center animate-pulse opacity-50" />
              <p className="text-sm text-text-secondary font-medium text-center">
                Maintenance Schedule
              </p>
              <span className="text-xs opacity-70 mt-1">Coming soon...</span>
            </div>
          </aside>

        </div>
        
        <p className="text-muted text-sm mb-6">
          No assets yet. As you register and view assets, they'll appear here.
        </p>

        <button className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-full text-sm font-medium text-foreground hover:bg-surface-hover transition-colors shadow-sm">
          <Box className="h-4 w-4 text-muted" />
          Allow system access
        </button>
        <p className="text-muted text-sm mt-2">
          to view assets stored in the database.
        </p>
      </div>
    </div>
  );
}