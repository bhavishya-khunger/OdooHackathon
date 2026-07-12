"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, ArrowRightLeft, CalendarClock, Package, Wrench } from 'lucide-react';
import { itemVariants, containerVariants, smoothTransition } from './motionVariants';

const statsData = [
  { label: 'Available', value: 128, icon: CheckCircle2, color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-500/30' },
  { label: 'Allocated', value: 76, icon: Package, color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-500/30' },
  { label: 'Maintenance', value: 4, icon: Wrench, color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-500/30' },
  { label: 'Active Bookings', value: 9, icon: CalendarClock, color: 'text-indigo-500 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-500/30' },
  { label: 'Pending Transfers', value: 3, icon: ArrowRightLeft, color: 'text-purple-500 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-500/30' },
  { label: 'Upcoming Returns', value: 12, icon: AlertTriangle, color: 'text-orange-500 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-500/30' },
];

export const StatsCardGrid = () => {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full"
    >
      {statsData.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={i}
            variants={itemVariants}
            whileHover={{ y: -4, scale: 1.02, transition: smoothTransition }}
            className={`relative p-5 rounded-3xl bg-white/80 dark:bg-[#051324]/60 backdrop-blur-2xl border border-slate-200 dark:border-cyan-900/30 shadow-[0_4px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)] overflow-hidden group cursor-pointer`}
          >
            {/* Subtle Inner Glow on Hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-white/40 to-transparent dark:from-cyan-500/10 dark:to-transparent transition-opacity duration-500 pointer-events-none" />
            
            <div className="flex flex-col gap-3">
              <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center shadow-inner ${stat.bg}`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              
              <div>
                <h3 className="text-3xl font-serif tracking-tight text-slate-900 dark:text-white mb-1">{stat.value}</h3>
                <p className="text-xs font-mono text-slate-500 dark:text-cyan-100/50 uppercase tracking-wider">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
