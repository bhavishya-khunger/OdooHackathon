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
    <div className="relative min-h-full bg-bg-base text-text-primary p-10 font-sans transition-colors duration-300">
      <motion.div
        className="max-w-[1400px] mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Urgent Alerts Section */}
        <div className="mb-8">
          <AlertBanner />
        </div>

        {/* Header & Quick Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
          <div>
            <motion.h1 
              variants={itemVariants}
              className="text-[28px] font-semibold tracking-tight text-text-primary"
            >
              Dashboard
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="text-[14px] text-text-secondary mt-1"
            >
              Welcome back. Here's what's happening today.
            </motion.p>
          </div>
          
          <ActionButtonGroup />
        </div>

        {/* Top level KPIs */}
        <div className="mb-10">
          <StatsCardGrid />
        </div>

        {/* Main Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Activity Feed */}
          <div className="lg:col-span-2">
            <ActivityFeed />
          </div>

          {/* Right Column: Placeholders for charts/visualizations */}
          <motion.div variants={itemVariants} className="flex flex-col gap-6">
            <OverdueReturns />
            <div className="bg-bg-surface border border-border-base rounded-3xl p-6 min-h-[250px] flex items-center justify-center transition-colors duration-300">
              <p className="text-[14px] text-text-secondary font-medium text-center">
                Maintenance Schedule<br /><span className="text-[12px] opacity-70">Coming soon...</span>
              </p>
            </div>
          </motion.div>
        </div>

      </motion.div>
    </div>
  );
}