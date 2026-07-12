"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, ArrowRightLeft, CalendarClock, Package, Wrench } from 'lucide-react';
import { itemVariants, containerVariants } from './motionVariants';

const statsData = [
  { label: "Available", value: 128, icon: CheckCircle2, color: "text-[#f5f5f5]" },
  { label: "Allocated", value: 76, icon: Package, color: "text-[#888]" },
  { label: "Maintenance", value: 4, icon: Wrench, color: "text-[#888]" },
  { label: "Active Bookings", value: 9, icon: CalendarClock, color: "text-[#888]" },
  { label: "Pending Transfers", value: 3, icon: ArrowRightLeft, color: "text-[#888]" },
  { label: "Upcoming returns", value: 12, icon: AlertTriangle, color: "text-[#888]" }
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
            className="bg-[#141414] border border-[#222] rounded-2xl p-5 flex flex-col justify-between hover:bg-[#1a1a1a] transition-colors cursor-default"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[12px] font-semibold text-[#888] uppercase tracking-wider">{stat.label}</span>
              <Icon className={`h-[18px] w-[18px] ${stat.color}`} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#f5f5f5] tracking-tight">{stat.value}</span>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
