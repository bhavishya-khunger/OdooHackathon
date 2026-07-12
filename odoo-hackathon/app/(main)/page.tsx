"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '@/components/ui/motionVariants';

import { StatsCardGrid } from '@/components/ui/StatsCardGrid';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { ActionButtonGroup } from '@/components/ui/ActionButtonGroup';
import { ActivityFeed } from '@/components/ui/ActivityFeed';

export default function Dashboard() {
  return (
    <div className="relative min-h-full bg-[#0F0F0F] text-[#f5f5f5] p-10 font-sans">
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
              className="text-[28px] font-semibold tracking-tight text-[#f5f5f5]"
            >
              Dashboard
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="text-[14px] text-[#888] mt-1"
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
            <div className="bg-[#141414] border border-[#222] rounded-3xl p-6 min-h-[250px] flex items-center justify-center">
              <p className="text-[14px] text-[#888] font-medium text-center">
                Asset Allocation Chart<br /><span className="text-[12px] opacity-70">Coming soon...</span>
              </p>
            </div>
            <div className="bg-[#141414] border border-[#222] rounded-3xl p-6 min-h-[250px] flex items-center justify-center">
              <p className="text-[14px] text-[#888] font-medium text-center">
                Maintenance Schedule<br /><span className="text-[12px] opacity-70">Coming soon...</span>
              </p>
            </div>
          </motion.div>
        </div>

      </motion.div>
    </div>
  );
}