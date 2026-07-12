"use client";

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
      <motion.div
        className="max-w-[1400px] mx-auto flex flex-col gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Urgent Alerts Section */}
        <motion.div variants={itemVariants} className="w-full">
          <AlertBanner />
        </motion.div>

        {/* Header & Quick Actions */}
        <motion.header
          variants={itemVariants}
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
        </motion.header>

        {/* Top level KPIs */}
        <motion.section variants={itemVariants} className="w-full">
          <StatsCardGrid />
        </motion.section>

        {/* Main Content Split - Note the 'items-start' to allow sticky positioning */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Left Column: Activity Feed (Main Data) */}
          <motion.main variants={itemVariants} className="lg:col-span-2">
            <ActivityFeed />
          </motion.main>

          {/* Right Column: Context & Secondary Info (Sticky for UX) */}
          <motion.aside
            variants={itemVariants}
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
          </motion.aside>

        </div>
      </motion.div>
    </div>
  );
}