"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '../../components/ui/motionVariants';

import { StatsCardGrid } from '../../components/ui/StatsCardGrid';
import { AlertBanner } from '../../components/ui/AlertBanner';
import { ActionButtonGroup } from '../../components/ui/ActionButtonGroup';
import { ActivityFeed } from '../../components/ui/ActivityFeed';

export default function DeepAuroraDashboard() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#030b14] text-slate-800 dark:text-slate-200 overflow-hidden font-sans selection:bg-cyan-500/30 p-6 md:p-8 lg:p-12">

      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-cyan-900/10 dark:bg-cyan-900/10 blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-emerald-900/10 dark:bg-emerald-900/10 blur-[150px]"
        />
        <div className="absolute inset-0 dark:bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] dark:bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <motion.div
        className="max-w-[1400px] mx-auto relative z-10 flex flex-col gap-10"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* 2. Alert/Warning Banner */}
        <AlertBanner />

        {/* Header section with Heading and Action Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8 mb-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </div>
              <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 uppercase tracking-[0.2em] font-semibold">Fleet Synchronized</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-tight text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:via-cyan-100 dark:to-emerald-200">
              Command Rhythm.
            </h1>
            <p className="text-slate-500 dark:text-cyan-100/60 mt-4 max-w-lg text-base leading-relaxed">
              Track every asset from check-out to retirement — utilization, maintenance, and lifecycle status, all in one console.
            </p>
          </div>

          {/* 3. Action Button Group */}
          <ActionButtonGroup />
        </motion.div>

        {/* 1. Stats/KPI Card Grid ("Today's Overview") */}
        <motion.div variants={itemVariants} className="flex flex-col gap-6 mt-4">
          <h2 className="text-xl font-serif font-medium text-slate-800 dark:text-slate-200">Today's Overview</h2>
          <StatsCardGrid />
        </motion.div>

        {/* 4. Activity Feed ("Recent Activity") */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
          <motion.div variants={itemVariants} className="w-full">
            <ActivityFeed />
          </motion.div>
          {/* Leaving space for future expansions as per design request, keeping it beautiful and empty for now or maybe an empty state card? */}
          <motion.div variants={itemVariants} className="w-full hidden lg:flex flex-col justify-center items-center p-8 bg-white/40 dark:bg-[#051324]/30 backdrop-blur-xl border border-dashed border-slate-300 dark:border-cyan-900/30 rounded-3xl h-full">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-cyan-900/20 flex items-center justify-center mb-4">
              <span className="text-2xl opacity-50">✨</span>
            </div>
            <p className="text-slate-500 dark:text-cyan-100/50 font-medium text-center">
              More insights and visualizers<br />coming soon...
            </p>
          </motion.div>
        </div>

      </motion.div>
    </div>
  );
}