"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, ArrowRightLeft, CalendarClock, Package, Wrench, Box } from 'lucide-react';
import { itemVariants, containerVariants } from './motionVariants';

export interface StatItem {
  label: string;
  value: number;
  icon: any;
  color: string;
}

export const StatsCardGrid = ({ statsData }: { statsData: StatItem[] }) => {
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
            className="bg-surface border border-border rounded-2xl p-5 flex flex-col justify-between hover:bg-surface-hover transition-colors cursor-default shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</span>
              <Icon className={`h-[18px] w-[18px] ${stat.color}`} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground tracking-tight">{stat.value}</span>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
