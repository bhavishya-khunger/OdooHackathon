"use client";

import { Search, Plus, Grid3X3, Box } from 'lucide-react';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '../../components/ui/motionVariants';

import { StatsCardGrid } from '../../components/ui/StatsCardGrid';
import { AlertBanner } from '../../components/ui/AlertBanner';
import { ActionButtonGroup } from '../../components/ui/ActionButtonGroup';
import { ActivityFeed } from '../../components/ui/ActivityFeed';

export default function Dashboard() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden font-sans selection:bg-primary/30 p-6 md:p-8 lg:p-12">

      {/* Ambient background glows */}
      <div
        className="max-w-[1400px] mx-auto relative z-10 flex flex-col gap-10 animate-in fade-in duration-500"
        
        
        
      >
        {/* 2. Alert/Warning Banner */}
        <AlertBanner />

        {/* Header section with Heading and Action Buttons */}
        <div  className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8 mb-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </div>
              <span className="text-xs font-mono text-primary uppercase tracking-[0.2em] font-semibold">Fleet Synchronized</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-tight text-foreground">
              Command Rhythm.
            </h1>
            <p className="text-muted mt-4 max-w-lg text-base leading-relaxed">
              Track every asset from check-out to retirement — utilization, maintenance, and lifecycle status, all in one console.
            </p>
          </div>

          {/* 3. Action Button Group */}
          <ActionButtonGroup />
        </div>

        {/* 1. Stats/KPI Card Grid ("Today's Overview") */}
        <div  className="flex flex-col gap-6 mt-4">
          <h2 className="text-xl font-serif font-medium text-foreground">Today's Overview</h2>
          <StatsCardGrid />
        </div>

        {/* 4. Activity Feed ("Recent Activity") */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
          <div  className="w-full">
            <ActivityFeed />
          </div>
          {/* Leaving space for future expansions as per design request, keeping it beautiful and empty for now or maybe an empty state card? */}
          <div  className="w-full hidden lg:flex flex-col justify-center items-center p-8 bg-surface/50 border border-dashed border-border rounded-3xl h-full">
            <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center mb-4">
              <span className="text-2xl opacity-50">✨</span>
            </div>
            <p className="text-muted font-medium text-center">
              More insights and visualizers<br />coming soon...
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}