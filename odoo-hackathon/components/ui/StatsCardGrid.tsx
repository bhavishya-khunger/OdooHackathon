"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, ArrowRightLeft, CalendarClock, Package, Wrench } from 'lucide-react';
import { itemVariants, containerVariants } from './motionVariants';

const statsData = [
  { label: "Assets Available", value: 128, icon: CheckCircle2, color: "text-text-primary" },
  { label: "Assets Allocated", value: 76, icon: Package, color: "text-text-secondary" },
  { label: "Maintenance Today", value: 4, icon: Wrench, color: "text-text-secondary" },
  { label: "Active Bookings", value: 9, icon: CalendarClock, color: "text-text-secondary" },
  { label: "Pending Transfers", value: 3, icon: ArrowRightLeft, color: "text-text-secondary" },
  { label: "Upcoming Returns", value: 12, icon: AlertTriangle, color: "text-text-secondary" }
];

export const StatsCardGrid = () => {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
    >
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={index}
            variants={itemVariants}
            className="bg-bg-surface border border-border-base rounded-2xl p-5 flex flex-col justify-between hover:bg-bg-surface-alt transition-colors cursor-default"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[12px] font-semibold text-text-secondary uppercase tracking-wider">{stat.label}</span>
              <Icon className={`h-[18px] w-[18px] ${stat.color}`} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-text-primary tracking-tight">{stat.value}</span>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
